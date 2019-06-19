(function (app) {
    'use strict';

    app.controller("benthicSamplesAddBulkController", benthicSamplesAddBulkController);

    benthicSamplesAddBulkController.$inject = ['Upload', 'notificationFactory', 'userGroup','userRole'];

    function benthicSamplesAddBulkController(Upload, notificationFactory, userGroup, userRole) {
       
        var ctrl = this;
        ctrl.userGroup = userGroup;
        ctrl.uploading = false;
        ctrl.file;
        ctrl.uploadBulk = uploadBulk;
        ctrl.errors;
        if (userRole == 'Coordinator') {
            ctrl.isCoordinator = true;
        } else {
            ctrl.isCoordinator = false;
        }
        
        function uploadBulk() {
            ctrl.uploading = true;
            ctrl.errors = null;
            Upload.upload({
                url: '/Admin/BenthicSamplesBulk',
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
                    notificationFactory.success('Successfully added new samples.', 'Added Samples', { timeOut: 0, extendedTimeOut: 0 });                    
                }
            }).error(function (response) {
                ctrl.uploading = false;
                
                notificationFactory.error('Failed to add samples.', 'Error', { timeOut: 0, extendedTimeOut: 0 });
            });
        }
    };

}(angular.module("cmcApp")));