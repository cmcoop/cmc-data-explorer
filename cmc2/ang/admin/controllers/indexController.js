(function (app) {
    var indexController = function ($scope,userId,userName,userGroup,userGroupId,userService,sampleService,groupService,$log) {
        $scope.userName = userName;
        $scope.userGroup = userGroup;
        $scope.userGroupId = userGroupId;
        $scope.initialize = function () {
            var crntDt = new Date();
            var cHour = crntDt.getHours();
            var aMonthAgo = new Date();
            aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);
            $scope.strAMonthAgo = aMonthAgo.toJSON();
            var greeting = "Good Morning, ";
            if (cHour >= 12 && cHour < 16) {
                greeting = "Good Afternoon, ";
            } else if (cHour >= 16) {
                greeting = "Good Evening, ";
            }
            $scope.subTitle = greeting + $scope.userName;
            $scope.getStats();
        };
        $scope.getStats = function () {
            (new userService()).$getNewUsersInGroup({ minDateTime:$scope.strAMonthAgo,key: userGroupId })
            .then(function (data) {
                $scope.usersInGroup = data.value;
            });
            (new sampleService()).$newGroupSamples({ minDateTime: $scope.strAMonthAgo, groupId: userGroupId })
            .then(function (data) {
                $scope.newSamples = data.value;
            });
            
            (new sampleService()).$userSamplesNotPublished({ userId: userId, groupId: userGroupId })
            .then(function (data) {
                $scope.SamplesNotPublished = data.value;
            });
            if (typeof userGroupId !== 'undefined') {
                (new groupService()).$getById({ key: userGroupId })
                .then(function (data) {
                    (new userService()).$getByUserId({ key: data.CmcMember })
                     .then(function (data) {
                         $scope.cmcAdminEmail = data.value[0].Email;
                     });
                });
            }            
        };
    };
    indexController.$inject = ['$scope', 'userId', 'userName', 'userGroup', 'userGroupId', 'userService', 'sampleService', 'groupService', '$log'];
    app.controller("indexController", indexController);
}(angular.module("cmcApp")));