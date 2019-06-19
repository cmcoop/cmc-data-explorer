(function (app) {
    var calibrationParametersController = function ($scope, $log,groupService,relatedParameterService, notificationFactory, parameterService,oData) {
        //this function leverages angular.equals to do comparisons in array similar to jquery function $.inArray; however, it 
        //ignores some relics added by angular, such as $$hashtag - from use of ng-repeat in html. 
        
        $scope.initialize = function () {
            var activeElement = angular.element(document.querySelector('.active'));
            activeElement.removeClass('active');
            var menuManageElement = angular.element(document.querySelector('#menuManage'));
            menuManageElement.addClass('active');
            notificationFactory.success('Parameters are loading...', 'Loading', { timeOut: 0, extendedTimeOut: 0 });
            $scope.getParameters();
            
        };
       
        $scope.currentParameter = {};
        $scope.newParameter = {};
        $scope.populateDropdowns = function () {
            $scope.unitsList = units;

            //select null (first item in helper arrays) for all of these dropdowns 
            //when adding a new parameter. Otherwise angular
            //adds an extra blank to start of dropdown list. 
            $scope.newParameter.Units = $scope.unitsList[0].value;


            $scope.binaryList = binaryNoNull;
            $scope.newParameter.Tidal = $scope.binaryList[0].value;
            $scope.newParameter.NonTidal = $scope.binaryList[0].value;
            $scope.newParameter.isCalibrationParameter = $scope.binaryList[0].value;
            $scope.newParameter.requiresSampleDepth = $scope.binaryList[0].value;
            $scope.newParameter.requiresDuplicate = $scope.binaryList[0].value;

            


            $scope.tierList = tiers;
            $scope.newParameter.Tier = $scope.tierList[0].value;

            $scope.matrixList = matrix;
            $scope.newParameter.Matrix = $scope.matrixList[0].value;
            
            $scope.analyticalMethodList = analyticalMethods;
            $scope.newParameter.AnalyticalMethod = $scope.analyticalMethodList[0].value;
            $scope.inspectionFrequencyList = inspectionFrequency;
            $scope.newParameter.InspectionFreq = $scope.inspectionFrequencyList[0].value;
        };
        $scope.populateDropdowns();
        $scope.toggle = true;
        $scope.selectParameters = [];
        $scope.sort = function (keyname) {
            $scope.sortKey = ['!!' + keyname, keyname]; //need to add the !! to move empty fields to start of sort  
            $scope.sortKeyName = keyname; //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }
        $scope.sortParameter = function (keyname) {
            $scope.parameterSortKey = ['!!' + keyname, keyname]; //need to add the !! to move empty fields to start of sort  
            $scope.parameterSortKeyName = keyname; //set the sortKey to the param passed
            $scope.parameterReverse = !$scope.parameterReverse; //if true make it false and vice versa
        }
        
        $scope.getParameters = function () {
            $scope.selectedParameters = [];
            (new parameterService()).$getAllCalibration()
                .then(function (data) {
                    $scope.parameters = data.value;
                    $scope.reverse = true;
                    $scope.sort('Name');
                    $scope.headers = [];
                    angular.forEach(data.value[0], function (value, index) {
                        $scope.headers.push(index);
                    })
                    $scope.getWqParameters();
                    notificationFactory.success('Parameters Loaded.', 'Parameters Loaded');


                });
        };

        $scope.getWqParameters = function () {
            $scope.selectedParameters = [];
            (new parameterService()).$getAllWaterQuality()
                .then(function (data) {
                    $scope.wqParameters = data.value;

                    $scope.wqParametersList = [
                       {
                           "name": "",
                           "value": null
                       }
                    ];

                    angular.forEach($scope.wqParameters, function (value, index) {
                        $scope.wqParametersList.push({
                            "name": value.Name + ' (' + value.Code + ')',
                            "value": value.Id
                        })
                    });
                    $scope.newParameter.wqParametersIds = [];
                    //$scope.newParameter.wqParametersIds.push($scope.wqParametersList[0].value);
                    $scope.parametersLoaded = true;
                });
        };

        // Set active employee for patch update
        $scope.setParameter = function (parameter) {
            $scope.currentParameter = parameter;
            return (new relatedParameterService()).$getByCalibrationId({ key: $scope.currentParameter.Id })
            .then(function (data) {
                $scope.currentParameter.wqParametersIds = [];
                angular.forEach(data.value, function (value, index) {
                    $scope.currentParameter.wqParametersIds.push(value.WqParameterId);
                })
               
            });
        };

        $scope.updateParameter = function (form) {
            var currentParameter = $scope.currentParameter;
            notificationFactory.success('Updating information for ' + currentParameter.Name + '.', 'Update', { timeOut: 0, extendedTimeOut: 0 });
            if (form.$valid) {
                var updateParameter = {
                    "Name": currentParameter.Name,
                    "Description": currentParameter.Description,
                    "Code": currentParameter.Code,
                    "Units": currentParameter.Units,
                    "Method": currentParameter.Method,
                    "Tier": currentParameter.Tier,
                    "Matrix": currentParameter.Matrix,
                    "Tidal": currentParameter.Tidal,
                    "NonTidal": currentParameter.NonTidal,
                    "requiresSampleDepth": false,
                    "isCalibrationParameter": true,
                    "requiresDuplicate": currentParameter.requiresDuplicate,
                    "AnalyticalMethod": currentParameter.AnalyticalMethod,
                    "ApprovedProcedure": currentParameter.ApprovedProcedure,
                    "Equipment": currentParameter.Equipment,
                    "Precision": currentParameter.Precision,
                    "Accuracy": currentParameter.Accuracy,
                    "Range": currentParameter.Range,
                    "QcCriteria": currentParameter.QcCriteria,
                    "InspectionFreq": currentParameter.InspectionFreq,
                    "InspectionType": currentParameter.InspectionType,
                    "CalibrationFrequency": currentParameter.CalibrationFrequency,
                    "StandardOrCalInstrumentUsed": currentParameter.StandardOrCalInstrumentUsed,
                    "TierIIAdditionalReqs": currentParameter.TierIIAdditionalReqs,
                    "HoldingTime": currentParameter.HoldingTime,
                    "SamplePreservation": currentParameter.SamplePreservation
                }
                var batchRequest = [];
                batchRequest.push({ requestUri: "Parameters(" + currentParameter.Id + ")", method: "PATCH", data: updateParameter });

                if (currentParameter) {
                    oData.request({
                        requestUri: "/odata/$batch",
                        method: "POST",
                        data: {
                            __batchRequests: batchRequest
                        }
                    }, function (data, response) {                                              

                        return (new relatedParameterService()).$getByCalibrationId({ key: $scope.currentParameter.Id })
                        .then(function (data) {
                            var beforeParams = [];

                            angular.forEach(data.value, function (value, index) {
                                beforeParams.push(value.WqParameterId);
                            })
                            var afterParams = $scope.currentParameter.wqParametersIds;

                            var checkArray = [];
                            angular.forEach(beforeParams,function(value1,index1){
                                angular.forEach(afterParams, function (value2, index2) {
                                    if (value1 == value2) {
                                        
                                        checkArray.push(value1);
                                    }
                                })
                                if (checkArray.length == 0) {
                                    return (new relatedParameterService()).$getByCalibrationAndParameterId({ calibrationParameterId: $scope.currentParameter.Id, wqParameterId:value1 })
                                    .then(function (data) {
                                        return (new relatedParameterService()).$remove({ key: data.value[0].Id})
                                        //delete value1
                                    });                                   
                                }
                                checkArray = [];
                            })

                            angular.forEach(afterParams, function (value1, index1) {
                                angular.forEach(beforeParams, function (value2, index2) {
                                    if (value1 == value2) {
                                        checkArray.push(value1);
                                    }
                                })
                                if (checkArray.length == 0) {
                                    return (new relatedParameterService({ CalibrationParameterId: $scope.currentParameter.Id, WqParameterId: value1 })).$save()                                    
                                }
                                checkArray = [];
                            })

                        });
                        
                    }, undefined, window.odatajs.oData.batch.batchHandler);
                    notificationFactory.success(currentParameter.Name + ' is updated.', 'Parameter Updated');
                }
                angular.element('#editParameterModal').modal('hide');
                
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

        $scope.deleteParameter = function (parameter) {
            var currentParameter = parameter;
            notificationFactory.success(currentParameter.Name + ' is being deleted...', 'Deleting Parameter', { timeOut: 0, extendedTimeOut: 0 })
            return (new parameterService()).$remove({ key: currentParameter.Id })
            .then(function (data) {
                notificationFactory.success(currentParameter.Name + ' is deleted.', 'Parameter Deleted');
                $scope.getParameters();
            });
        }

        $scope.addParameter = function (form) {
            var newParameter = $scope.newParameter;
            if (form.$valid) {
                notificationFactory.success(newParameter.Name + ' is being added...', 'Adding Parameter', { timeOut: 0, extendedTimeOut: 0 })
                return (new parameterService({
                    "Name": newParameter.Name,
                    "Description": newParameter.Description,
                    "Code": newParameter.Code,
                    "Units": newParameter.Units,
                    "Method": newParameter.Method,
                    "Tier": newParameter.Tier,
                    "Matrix": newParameter.Matrix,
                    "Tidal": newParameter.Tidal,
                    "NonTidal": newParameter.NonTidal,
                    "isCalibrationParameter": true,
                    "requiresSampleDepth": false,
                    "requiresDuplicate": newParameter.requiresDuplicate,
                    "AnalyticalMethod": newParameter.AnalyticalMethod,
                    "ApprovedProcedure": newParameter.ApprovedProcedure,
                    "Equipment": newParameter.Equipment,
                    "Precision": newParameter.Precision,
                    "Accuracy": newParameter.Accuracy,
                    "Range": newParameter.Range,
                    "QcCriteria": newParameter.QcCriteria,
                    "InspectionFreq": newParameter.InspectionFreq,
                    "InspectionType": newParameter.InspectionType,
                    "CalibrationFrequency": newParameter.CalibrationFrequency,
                    "StandardOrCalInstrumentUsed": newParameter.StandardOrCalInstrumentUsed,
                    "TierIIAdditionalReqs": newParameter.TierIIAdditionalReqs,
                    "HoldingTime": newParameter.HoldingTime,
                    "SamplePreservation": newParameter.SamplePreservation
                    
                })).$save()
                .then(function (data) {
                    if ($scope.newParameter.wqParametersIds.length > 0) {
                        angular.forEach($scope.newParameter.wqParametersIds, function (value, index) {
                            var wqParameterRelate =
                                {
                                    'CalibrationParameterId': data.Id,
                                    'WqParameterId': value
                                }
                            return (new relatedParameterService(wqParameterRelate).$save());
                        });
                    }
                    notificationFactory.success(newParameter.Name + ' added successfully', 'Parameter Added!');
                    $scope.newParameter = {};
                    $scope.getParameters();
                    $('#addParameterModal').modal('hide');
                    angular.element('#addParameterModal').modal('hide');
                    $scope.clearNewParameter(form);
                });
            } else {
                notificationFactory.error('Please check form for errors', 'Something went wrong');
                console.log(form);
                form.$pristine = false;
                angular.forEach(form.$error, function (field) {
                    angular.forEach(field, function (errorField) {
                        errorField.$setTouched();
                    })
                });
            }
        }
        $scope.clearNewParameter = function (form) {
            $scope.newParameter = {};
            $scope.clearFormValidation(form);
        }
        $scope.clearFormValidation = function (form) {
            form.$setUntouched();
            form.$pristine = true;
        }
    };
    calibrationParametersController.$inject = ['$scope', '$log', 'groupService', 'relatedParameterService', 'notificationFactory', 'parameterService', 'oData'];
    app.controller("calibrationParametersController", calibrationParametersController);
}(angular.module("cmcApp")));