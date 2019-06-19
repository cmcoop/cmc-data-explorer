(function (app) {
    var submissionsController = function ($scope, $log, $http, $q, userRole) {
        //this function leverages angular.equals to do comparisons in array similar to jquery function $.inArray; however, it ,
        //this function leverages angular.equals to do comparisons in array similar to jquery function $.inArray; however, it 
        //ignores some relics added by angular, such as $$hashtag - from use of ng-repeat in html. 

        $scope.initialize = function () {
            $scope.loading = true;
            
            if (userRole == 'Member' || userRole == 'Officer' || userRole == 'Admin') {
                $scope.allow = true;
            } 
            var promises = [                
                $scope.getCedrTracking(),
                
            ]
            $q.all(promises)
           .then(function (values) {
               $scope.submissions = values[0].data;
               $scope.loading = false;
           })
        };

        $scope.getCedrTracking = function () {
            return $http({ method: 'GET', url: '../odata/GetCedrTracking' });
        }
    }
    submissionsController.$inject = ['$scope', '$log', '$http','$q','userRole' ];
    app.controller("submissionsController", submissionsController);
}(angular.module("cmcApp")));