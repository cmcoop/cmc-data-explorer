(function (app) {
    var benthicSamplesUploadTypeController = function ($scope,$window,userRole) {
        $scope.initialize = function () {
            $scope.showContent = false;
            if (userRole == 'Monitor') {
                $window.location.href = '#/benthicSamplesAdmin/add';
            } else {
                $scope.showContent = true;
            }
            var activeElement = angular.element(document.querySelector('.active'));
            activeElement.removeClass('active');
            var menuDataElement = angular.element(document.querySelector('#menuData'));            
            menuDataElement.addClass('active');
        }
            
    };
    benthicSamplesUploadTypeController.$inject = ['$scope', '$window', 'userRole'];
    app.controller("benthicSamplesUploadTypeController", benthicSamplesUploadTypeController);
}(angular.module("cmcApp")));