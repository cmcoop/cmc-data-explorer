(function (app) {
    var labsController = function ($scope, $log, userId,
        notificationFactory, labService, oData) {
    
        
        $scope.currentLab = {};
        $scope.newLab = {};
        $scope.initialize = function () {
            var activeElement = angular.element(document.querySelector('.active'));
            activeElement.removeClass('active');
            var menuManageElement = angular.element(document.querySelector('#menuManage'));
            menuManageElement.addClass('active');
            notificationFactory.success('Labs are loading...', 'Loading', { timeOut: 0, extendedTimeOut: 0 });
            $scope.labsUploaded = false;
            $scope.getLabs();
        }
       
        $scope.toggle = true;
        $scope.selectLabs = [];
        $scope.sort = function (keyname) {
            $scope.sortKey = ['!!' + keyname, keyname]; //need to add the !! to move empty fields to start of sort  
            $scope.sortKeyName = keyname; //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }
        $scope.sortLab = function (keyname) {
            $scope.labSortKey = ['!!' + keyname, keyname]; //need to add the !! to move empty fields to start of sort  
            $scope.labSortKeyName = keyname; //set the sortKey to the param passed
            $scope.labReverse = !$scope.labReverse; //if true make it false and vice versa
        }
        
        $scope.getLabs = function () {
            

            $scope.selectedLabs = [];
            (new labService()).$getAll()
                .then(function (data) {
                    $scope.labsUploaded = true;
                    $scope.headers = [];
                    angular.forEach(data.value[0], function (value, index) {
                        $log.log(index);
                        $scope.headers.push(index);
                    })
                    $scope.labs = data.value;
                    $scope.reverse = true;
                    $scope.sort('Name');
                    notificationFactory.success('Labs Loaded.', 'Labs Loaded');
                    

                });

        };
    
        // Set active employee for patch update
        $scope.setLab = function (lab) {
            $scope.currentLab = lab;
            $log.log(lab.TierIIAdditionalReqs);
            $scope.getLabs();
            //$scope.setCurrentEmployeeCompany();
        };
        
        

        $scope.updateLab = function (form) {
            var DateTimeNow = new Date().toJSON();
            if (form.$valid) {
                var currentLab = $scope.currentLab;
                notificationFactory.success('Updating information for ' + currentLab.Name + '.', 'Update', { timeOut: 0, extendedTimeOut: 0 });
                var updateLab = {
                    "Name": currentLab.Name,
                    "Code": currentLab.Code,
                    "Description": currentLab.Description,
                    "ModifiedBy": userId,
                    "ModifiedDate": DateTimeNow,
                    
                }
                var labId = currentLab.Id;
                $log.log(labId);
                var batchRequest = [];
                batchRequest.push({ requestUri: "Labs(" + currentLab.Id + ")", method: "PATCH", data: updateLab });

                if (currentLab) {
                    oData.request({
                        requestUri: "/odata/$batch",
                        method: "POST",
                        data: {
                            __batchRequests: batchRequest
                        }
                    }, function (data, response) {
                        $scope.getLabs();
                    }, undefined, window.odatajs.oData.batch.batchHandler);
                }
                angular.element('#editLabModal').modal('hide');
            } else {
                notificationFactory.error('Please check form for errors', 'Something went wrong');
                console.log(form);
                angular.forEach(form.$error, function (field) {
                    angular.forEach(field, function (errorField) {
                        errorField.$setTouched();
                    })
                });
            }
        }

        $scope.deleteLab = function (lab) {
            var currentLab = lab;
            notificationFactory.success(currentLab.Name + ' is being deleted...', 'Deleting Lab', { timeOut: 0, extendedTimeOut: 0 })
            return (new labService()).$remove({ key: currentLab.Id })
            .then(function (data) {
                notificationFactory.success(currentLab.Name + ' is deleted.', 'Lab Deleted');
                $scope.getLabs();
            });
        }

        $scope.addLab = function (form) {
            var DateTimeNow = new Date().toJSON();
            if (form.$valid) {
                var newLab = $scope.newLab;
                $log.log(newLab);
                notificationFactory.success(newLab.Name + ' is being added...', 'Adding Lab', { timeOut: 0, extendedTimeOut: 0 })
                return (new labService({
                    "Name": newLab.Name,
                    "Code": newLab.Code,
                    "Description": newLab.Description,
                    "CreatedBy": userId,
                    "ModifiedBy": userId,
                    "ModifiedDate": DateTimeNow,
                    "CreatedDate": DateTimeNow
                })).$save()
                .then(function (data) {
                    notificationFactory.success(newLab.Name + ' added successfully', 'Lab Added!');
                    $scope.newLab = {};
                    $scope.getLabs();
                    $('#addLabModal').modal('hide');
                    $scope.clearNewLab(form);
                });
            } else {
                notificationFactory.error('Please check form for errors', 'Something went wrong');
                console.log(form);
                angular.forEach(form.$error, function (field) {
                    angular.forEach(field, function (errorField) {
                        errorField.$setTouched();
                    })
                });
            }
        }
        $scope.clearNewLab = function (form) {
            $scope.newLab = {};
            $scope.clearFormValidation(form);
        }
        $scope.clearFormValidation = function (form) {
            form.$setUntouched();
        }
    };
    labsController.$inject = ['$scope', '$log', 'userId',
        'notificationFactory', 'labService', 'oData'];
    app.controller("labsController", labsController);
}(angular.module("cmcApp")));