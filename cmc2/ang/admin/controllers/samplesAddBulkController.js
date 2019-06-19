(function (app) {
    'use strict';

    app.controller("samplesAddBulkController", samplesAddBulkController);

    samplesAddBulkController.$inject = ['Upload', 'notificationFactory', 'userGroup','userRole','$log','$state'];

    function samplesAddBulkController(Upload, notificationFactory, userGroup, userRole,$log,$state) {
       
        var ctrl = this;
        ctrl.userGroup = userGroup;
        ctrl.uploading = false;
        ctrl.hasWarning = false;
        ctrl.file;
        ctrl.uploadBulk = uploadBulk;
        ctrl.uploaded = false;
        if (userRole == 'Coordinator') {
            ctrl.isCoordinator = true;
        } else {
            ctrl.isCoordinator = false;
        }

        ctrl.reloadRoute = function () {
            $state.reload();
        }

        function uploadBulk() {
            ctrl.uploading = true;
            ctrl.uploaded = true;
            ctrl.errors = null;
            Upload.upload({
                url: '/Admin/SamplesBulk',
                fields: {hasWarning:ctrl.hasWarning }, // additional data to send
                file: ctrl.file
            }).success(function (data, status, headers, config) {
                if (data.status === 409) {
                    $log.log('test');
                    $log.log(data.errors);
                    ctrl.errors = [];
                    ctrl.warnings = [];
                    angular.forEach(data.errors, function (v, k) {
                        $log.log(v.key.substring(0, 17));
                        if (v.warning == true) {
                            ctrl.warnings.push(v);                            
                        } else {
                            ctrl.errors.push(v);
                        }
                    });
                    ctrl.uploading = false;
                    
                    if (ctrl.warnings.length > 0 && ctrl.errors.length == 0) {
                        notificationFactory.error('There are warnings detected in the data submitted.', 'Warnings', { timeOut: 0, extendedTimeOut: 0 });
                        ctrl.hasWarning = true;
                    } else if (ctrl.errors.length > 0 && ctrl.warnings.length == 0) {
                        notificationFactory.error('There are errors detected in the data submitted.', 'Errors', { timeOut: 0, extendedTimeOut: 0 });
                        ctrl.hasWarning = false;
                    } else if (ctrl.errors.length > 0 && ctrl.warnings.length > 0) {
                        notificationFactory.error('There are errors and warnings detected in the data submitted.', 'Errors and Warnings', { timeOut: 0, extendedTimeOut: 0 });
                        ctrl.hasWarning = false;
                    }                    
                } else {
                    ctrl.errors = null;
                    ctrl.file = null;
                    ctrl.hasWarning = false;
                    ctrl.warnings = null;
                    ctrl.uploading = false;
                    ctrl.uploaded = false;
                    notificationFactory.success('Successfully added new samples.', 'Adding Samples', { timeOut: 0, extendedTimeOut: 0 });
                }
            }).error(function (response) {
                ctrl.uploading = false;
                
                notificationFactory.error('Failed to add samples.', 'Error', { timeOut: 0, extendedTimeOut: 0 });
            });

            
        }
    };
}(angular.module("cmcApp")));