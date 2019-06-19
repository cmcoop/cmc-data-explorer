(function (app) {
    'use strict';

    app.controller("usersAddBulkController", usersAddBulkController);

    usersAddBulkController.$inject = ['Upload', 'notificationFactory','sampleService'];

    function usersAddBulkController(Upload, notificationFactory, sampleService) {
        var ctrl = this;

        ctrl.uploading = false;
        ctrl.file;
        ctrl.uploadBulk = uploadBulk;
        ctrl.errors;
        

        function uploadBulk() {
            ctrl.uploading = true;

            Upload.upload({
                url: '/Admin/UsersBulk',
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
                    notificationFactory.success('Successfully added new users.', 'Adding Users', { timeOut: 0, extendedTimeOut: 0 });
                }
            }).error(function (response) {
                
                notificationFactory.error('Failed to add new users.  ' , 'Error', { timeOut: 0, extendedTimeOut: 0 });
            });
        }
    };

}(angular.module("cmcApp")));