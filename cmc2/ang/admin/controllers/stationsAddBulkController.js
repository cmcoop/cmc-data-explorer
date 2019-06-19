(function (app) {
    'use strict';

    app.controller("stationsAddBulkController", stationsAddBulkController);

    stationsAddBulkController.$inject = ['Upload', 'notificationFactory', 'userGroup', '$log', 'userId'];

    function stationsAddBulkController(Upload, notificationFactory, userGroup, userId) {
        
        var ctrl = this;
        ctrl.userId = userId;
        ctrl.userGroup = userGroup;
        ctrl.uploading = false;
        ctrl.file;
        ctrl.uploadBulk = uploadBulk;
        ctrl.errors;
        function uploadBulk() {
            ctrl.uploading = true;
            
            Upload.upload({
                url: '/Admin/StationsBulk',
                fields: { }, // additional data to send
                file: ctrl.file
            }).success(function (data, status, headers, config) {
                ctrl.uploading = false;

                if (data.status === 409) {
                    ctrl.errors = data.errors;
                    notificationFactory.error('There was an error in the data submitted.', 'Error', { timeOut: 0, extendedTimeOut: 0 });
                } else {
                    ctrl.errors = null;
                    ctrl.file = null;
                    notificationFactory.success('Successfully added new stations.', 'Adding Stations', { timeOut: 0, extendedTimeOut: 0 });
                }
            }).error(function (response) {
                ctrl.uploading = false;

                notificationFactory.error('Failed to add new stations.', 'Error', { timeOut: 0, extendedTimeOut: 0 });
            });
        }
    };

}(angular.module("cmcApp")));