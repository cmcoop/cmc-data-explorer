(function (app) {
    var parametersController = function ($scope, $log, groupService, notificationFactory,
        parameterService, oData) {
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
            $scope.search = [];

            //select null (first item in helper arrays) for all of these dropdowns 
            //when adding a new parameter. Otherwise angular
            //adds an extra blank to start of dropdown list. 
            $scope.newParameter.Units = $scope.unitsList[0].value;


            $scope.binaryList = binary;
            $scope.newParameter.Tidal = $scope.binaryList[0].value;
            $scope.newParameter.NonTidal = $scope.binaryList[0].value;
            $scope.newParameter.requiresDuplicate = $scope.binaryList[0].value;
            $scope.newParameter.requiresSampleDepth = $scope.binaryList[0].value;


            $scope.manageParametersDropdownList = manageParametersDropdown;
            $scope.search.Name = $scope.manageParametersDropdownList[0].value;


            $scope.tierList = tiers;
            $scope.newParameter.Tier = $scope.tierList[0].value;
            $scope.tableTierList = [];
            angular.forEach($scope.tierList, function (v, k) {
                $scope.tableTierList.push({name: v.name,value:v.value});
            });
            $scope.tableTierList[0].name = "Filter Tier";
            $scope.tableTierList[0].value = '';
            $scope.search.Tier = $scope.tableTierList[0].value;

            $scope.matrixList = matrix;
            $scope.newParameter.Matrix = $scope.matrixList[0].value;
            
            $scope.inSituOrLabList = inSituOrLab;
            $scope.newParameter.InSituOrLab = $scope.inSituOrLabList[0].value;

            $scope.analyticalMethodList = analyticalMethods;
            $scope.newParameter.AnalyticalMethod = $scope.analyticalMethodList[0].value;

            $scope.calibrationFrequencyList = calibrationFrequency;
            $scope.newParameter.CalibrationFrequency = $scope.calibrationFrequencyList[0].value;

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

        $scope.filterParams = function (srch) {
            $log.log(srch.Tier);
            if (srch.Tier == null) {
                $log.log('yes')
                return true;
            } else{
                return ;
            } 
            
        }
        
        $scope.getParameters = function () {
            $scope.selectedParameters = [];
            (new parameterService()).$getAllWaterQuality()
                .then(function (data) {
                    $scope.parameters = data.value;
                    $scope.paramsDownload = [];
                    //populate download

                   
                    angular.forEach($scope.parameters, function (value, index) {
                        if (value.Tier == null) {
                            value.Tier = '';
                        } 
                        var param = {
                            "Name": value.Name,
                            "Description": value.Description,
                            "CMC Code": value.Code,
                            "Units": value.Units,
                            "CBP Method": value.Method,
                            "Tier": value.Tier,
                            "NonfatalLowerRange": value.NonfatalLowerRange,
                            "NonfatalUpperRange": value.NonfatalUpperRange,
                            "Matrix": value.Matrix,
                            "Tidal": value.Tidal,
                            "Non Tidal?": value.NonTidal,
                            "Requires Sample Depth?": value.requiresSampleDepth,
                            "Requires Duplicate?": value.requiresDuplicate,
                            "Is Calibration Parameter?": value.isCalibrationParameter,
                            "Analytical Method": value.AnalyticalMethod,
                            "USEPA Approved Procedure": value.ApprovedProcedure,
                            "Equipment": value.Equipment,
                            "Precision": value.Precision,
                            "Accuracy": value.Accuracy,
                            "Range": value.Range,
                            "In Situ Or Lab?": value.InSituOrLab,
                            "Qc Criteria?": value.QcCriteria,
                            "Inspection Frequency": value.InspectionFreq,
                            "Inspection Type": value.InspectionType,
                            "Calibration Frequency": value.CalibrationFrequency,
                            "Standard Or Cal Instrument Used": value.StandardOrCalInstrumentUsed,
                            "Tier Justification": value.TierIIAdditionalReqs,
                            "Holding Time": value.HoldingTime,
                            "Sample Preservation": value.SamplePreservation
                        }
                        $scope.paramsDownload.push(param);
                    })
                    $scope.reverse = true;
                    $scope.sort('Name');
                    $scope.headers = [];
                    angular.forEach($scope.paramsDownload[0], function (value, index) {
                        $scope.headers.push(index);
                    })
                    $scope.parametersLoaded = true;

                    notificationFactory.success('Parameters Loaded.', 'Parameters Loaded');


                });
        };
        // Set active employee for patch update
        $scope.setParameter = function (parameter) {
            $scope.currentParameter = parameter;
            if ($scope.currentParameter.Tier == '') {
                $scope.currentParameter.Tier = null;
            }
            $scope.getParameters();
            //$scope.setCurrentEmployeeCompany();
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
                    "NonfatalLowerRange": parseFloat(currentParameter.NonfatalLowerRange),
                    "NonfatalUpperRange": parseFloat(currentParameter.NonfatalUpperRange),
                    "Matrix": currentParameter.Matrix,
                    "Tidal": currentParameter.Tidal,
                    "NonTidal": currentParameter.NonTidal,
                    "requiresSampleDepth": currentParameter.requiresSampleDepth,
                    "requiresDuplicate": currentParameter.requiresDuplicate,
                    "isCalibrationParameter": false,
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
                        $scope.getParameters();
                    }, undefined, window.odatajs.oData.batch.batchHandler);
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
                    "NonfatalLowerRange": parseFloat(newParameter.NonfatalLowerRange),
                    "NonfatalUpperRange": parseFloat(newParameter.NonfatalUpperRange),
                    "Matrix": newParameter.Matrix,
                    "Tidal": newParameter.Tidal,
                    "NonTidal": newParameter.NonTidal,
                    "isCalibrationParameter": false,
                    "requiresSampleDepth": newParameter.requiresSampleDepth,
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
    parametersController.$inject = ['$scope', '$log', 'groupService', 'notificationFactory',
        'parameterService', 'oData'];
    app.controller("parametersController", parametersController);
}(angular.module("cmcApp")));