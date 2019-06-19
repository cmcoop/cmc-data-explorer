(function (app) {
    var conditionsController = function ($scope, $log, groupService,
        notificationFactory, conditionService, oData) {
        //this function leverages angular.equals to do comparisons in array similar to jquery function $.inArray; however, it 
        //ignores some relics added by angular, such as $$hashtag - from use of ng-repeat in html. 
        
        $scope.currentCondition = {};
        $scope.newCondition = {};
       
        $scope.toggle = true;
        $scope.selectConditions = [];
        $scope.sort = function (keyname) {
            $scope.sortKey = ['!!' + keyname, keyname]; //need to add the !! to move empty fields to start of sort  
            $scope.sortKeyName = keyname; //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }
        $scope.sortCondition = function (keyname) {
            $scope.conditionSortKey = ['!!' + keyname, keyname]; //need to add the !! to move empty fields to start of sort  
            $scope.conditionSortKeyName = keyname; //set the sortKey to the param passed
            $scope.conditionReverse = !$scope.conditionReverse; //if true make it false and vice versa
        }
        
        $scope.getConditions = function () {
            var activeElement = angular.element(document.querySelector('.active'));
            activeElement.removeClass('active');
            var menuManageElement = angular.element(document.querySelector('#menuManage'));
            menuManageElement.addClass('active');
            notificationFactory.success('Conditions are loading...', 'Loading', { timeOut: 0, extendedTimeOut: 0 });

            $scope.selectedConditions = [];
            (new conditionService()).$getAll()
                .then(function (data) {
                    $scope.conditions = data.value;
                    $scope.reverse = true;
                    $scope.sort('Name');
                    notificationFactory.success('Conditions Loaded.', 'Conditions Loaded');

                });
        };
    
        // Set active employee for patch update
        $scope.setCondition = function (condition) {
            $scope.currentCondition = condition;
            $scope.getConditions();
            //$scope.setCurrentEmployeeCompany();
        };
        
        

        $scope.updateCondition = function (form) {
            if (form.$valid) {
                var currentCondition = $scope.currentCondition;
                notificationFactory.success('Updating information for ' + currentCondition.Name + '.', 'Update', { timeOut: 0, extendedTimeOut: 0 });
                var updateCondition = {
                    "Name": currentCondition.Name,
                    "Code": currentCondition.Code,
                    "Description": currentCondition.Description

                }
                var batchRequest = [];
                batchRequest.push({ requestUri: "Conditions(" + currentCondition.Id + ")", method: "PATCH", data: updateCondition });

                if (currentCondition) {
                    oData.request({
                        requestUri: "/odata/$batch",
                        method: "POST",
                        data: {
                            __batchRequests: batchRequest
                        }
                    }, function (data, response) {
                        $scope.getConditions();
                    }, undefined, window.odatajs.oData.batch.batchHandler);
                }
                angular.element('#editConditionModal').modal('hide');
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

        $scope.deleteCondition = function (condition) {
            var currentCondition = condition;
            notificationFactory.success(currentCondition.Name + ' is being deleted...', 'Deleting Condition', { timeOut: 0, extendedTimeOut: 0 })
            return (new conditionService()).$remove({ key: currentCondition.Id })
            .then(function (data) {
                notificationFactory.success(currentCondition.Name + ' is deleted.', 'Condition Deleted');
                $scope.getConditions();
            });
        }

        $scope.addCondition = function (form) {
            if (form.$valid) {
                var newCondition = $scope.newCondition;
                notificationFactory.success(newCondition.Name + ' is being added...', 'Adding Condition', { timeOut: 0, extendedTimeOut: 0 })
                return (new conditionService({
                    "Name": newCondition.Name,
                    "Code": newCondition.Code,
                    "Description": newCondition.Description
                })).$save()
                .then(function (data) {
                    notificationFactory.success(newCondition.Name + ' added successfully', 'Condition Added!');
                    $scope.newCondition = {};
                    $scope.getConditions();
                    $('#addConditionModal').modal('hide');
                    $scope.clearNewCondition(form);
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
        $scope.clearNewCondition = function (form) {
            $scope.newCondition = {};
            $scope.clearFormValidation(form);
        }
        $scope.clearFormValidation = function (form) {
            form.$setUntouched();
        }
    };
    conditionsController.$inject = ['$scope', '$log', 'groupService',
                                    'notificationFactory', 'conditionService', 'oData'];
    app.controller("conditionsController", conditionsController);
}(angular.module("cmcApp")));