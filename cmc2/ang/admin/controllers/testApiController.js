(function (app) {
    var testApiController = function ($scope, $log, $http) {

        $scope.initialize = function () {
            var data = {
                "Id":2178,
                "BenthicEventId": 133,
                "BenthicConditionId": 12,//11
                "Value": "102"
            }

            $http({
                url: "/odata/BenthicEventConditions",
                method: "POST",
                data: data
            }).then(
            function (response) {
                var data = response.data;
                $log.log('success');
                $log.log(data);
                $scope.showContent = true;
            }, function (error) {
                var data = error.data;
                $log.log('error');
                $log.log(data);
            });
        };
    };
    testApiController.$inject = ['$scope', '$log', '$http'];
    app.controller("testApiController", testApiController);
}(angular.module("cmcApp")));