(function (app) {
    var samplesUploadTypeController = function ($scope,$window,userRole) {
        $scope.initialize = function () {
            $scope.showContent = false;
            if (userRole == 'Monitor') {
                $window.location.href = '#/samplesAdmin/add';
            } else {
                $scope.showContent = true;
            }
            var activeElement = angular.element(document.querySelector('.active'));
            activeElement.removeClass('active');
            var menuDataElement = angular.element(document.querySelector('#menuData'));            
            menuDataElement.addClass('active');
        }
            
    };
    samplesUploadTypeController.$inject = ['$scope', '$window', 'userRole'];
    app.controller("samplesUploadTypeController", samplesUploadTypeController);
}(angular.module("cmcApp")));