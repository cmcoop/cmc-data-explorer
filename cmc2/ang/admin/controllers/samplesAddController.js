(function (app) {
    var samplesAddController = function ($scope, $filter, $log, $q, $anchorScroll, stationGroupService, parameterService,
                                            eventService, sampleService,
                                            userGroup,userGroupId, userRole, userId, userName,
                                            qualifierService, problemService, conditionService,
                                            eventConditionService, groupService,conditionCategoriesService,
                                            notificationFactory, stationService, oData,userService,
                                            monitorLogService,
                                            leafletMapEvents, leafletData, $timeout,$location,$window) {


        $scope.initialize = function () {
            var ctrl = this;
            if (userRole == 'Monitor' | userRole == 'Coordinator') {
                $scope.isMonitorOrCoordinator = true;
            } else {
                $scope.isMonitorOrCoordinator = false;
            }
            $scope.confirmedNoSamples = false;
            $scope.loading = true;
            $scope.profileDepthError = false;
            $scope.userGroup = userGroup;
            $scope.userName = userName;
            $scope.noDepthProfileParameters = false;
            $scope.dupsArray = [];
            $scope.prmSetIndex = 0;
            $scope.prmSetIndices = [];            
            $scope.prmSetIndices.push($scope.prmSetIndex);
            $scope.confirmedWarnings = false;
            var activeElement = angular.element(document.querySelector('.active'));
            activeElement.removeClass('active');
            var menuDataElement = angular.element(document.querySelector('#menuData'));
            menuDataElement.addClass('active');
            //$scope.slctGroupId = parseInt(userGroupId);
            $scope.setVariables();
            var promises = [
                //$scope.getStations(userGroupId),
                $scope.getGroups(),
                $scope.getProblems(),
                $scope.getQualifiers(),
                //$scope.getParameters(),
                $scope.getGroup(),
                $scope.getConditions()
                //$scope.getUsers()
                //$scope.getParametersWoSampleDepth()
            ]
            

            $q.all(promises)
            .then(function (values) {
                //$scope.parameters = [];

                $scope.problemsList = [{
                    "name": "If needed, select problem code",
                    "value": null
                }];
                $scope.qualifiersList = [{
                    "name": "If needed, select qualifier code",
                    "value": null
                }];
                $scope.groupsList = [];


                //$scope.stations = values[0].value;


                

                //$scope.groupParams = values[4].ParameterGroups;

                $scope.surfaceDepthsList = surfaceSampleDepths;
                $scope.surfaceDepth = $scope.surfaceDepthsList[0].value;

                $scope.conditionSetList = conditionSet;
                $scope.conditionSetValue = $scope.conditionSetList[0].value;

                $scope.problems = values[1].value;
                angular.forEach($scope.problems, function (value, key) {
                    $scope.problemsList.push(
                        {
                            value: value.Id,
                            name: value.Code + ' - ' + value.ApplicationText
                        }
                    );
                });

                $scope.qualifiers = values[2].value;
                angular.forEach($scope.qualifiers, function (value, key) {
                    $scope.qualifiersList.push(
                        {
                            value: value.Id,
                            name: value.Code
                        }
                    );
                });

                $scope.groups = values[0].value;
                $scope.groupIds = [];
                angular.forEach($scope.groups, function (value, key) {
                    if(value.ParameterGroups.length > 1){
                        $scope.groupsList.push(
                            {
                                value: value.Id,
                                name: value.Name
                            }
                        );
                        $scope.groupIds.push(value.Id);
                    }
                });                
                var grpId = parseInt(userGroupId);
                $scope.groupHasNoParameters = false;
                if ($scope.groupIds.indexOf(grpId) < 0) {
                    if ($scope.isMonitorOrCoordinator) {
                        $scope.groupHasNoParameters = true;
                    } else {
                        $scope.slctGroupId = $scope.groupsList[0].value;
                    }
                } else {
                    $scope.slctGroupId = grpId;                    
                }
                $scope.conditions = values[4].value;

                $scope.setupConditionDropdowns();

               
                //$scope.populateParameterFormElements(userGroupId);
                //var grp = $scope.getGroup(grpId);
                //$scope.parameterGroups = grp.ParameterGroups;

                //angular.forEach($scope.parameterGroups, function (value, key) {
                //    $scope.parameters.push(value.Parameter);
                //});
                $timeout(function () {
                    $('.selectpicker').selectpicker('refresh');
                }, 1);
            });
        };
        
        // set maximum date to tomorrow
        $scope.maxDateMoment = moment().format('YYYYMMDD');


        $scope.setVariables = function () {
            $scope.newEvent = {};
            $scope.newSamples = {};
            $scope.newCondition = {};
            $scope.depths = {};
            $scope.monitors = [];
            
        }
        $scope.populateUserDropdowns = function (grpId) {

            return (new userService()).$getActiveUsersInGroup({ key: grpId }).then(function (v, k) {
                var users = v.value;
                $scope.groupUsersList = [{
                    value: null,
                    name: ""
                }];

                angular.forEach(users, function (value, key) {
                    $scope.groupUsersList.push(
                        {
                            value: value.Id,
                            name: value.FirstName + ' ' + value.LastName
                        }
                      );
                });

                //angular.forEach([0,1,2,3,4,5,6,7,8,9,10], function (value, index) {
                
               
                //});

            });
        }


        $scope.setupConditionDropdowns = function () {
            angular.forEach($scope.conditions, function (value, key) {
                if (value.isCategorical == true) {
                    $scope[value.Code] = [];

                    return (new conditionCategoriesService()).$getByCategoryId({ key: value.Id }).then(function (data) {
                        

                        angular.forEach(data.value, function (v, k) {
                            
                            $scope[value.Code].push(
                                {
                                    value: v.Category,
                                    name: v.CategoryText
                                }
                            );
                        });
                        value.Categories = $scope[value.Code];
                        value.Value = $scope[value.Code][0].value;
                    });

                }
            });
        }
        
        $scope.populateStationsDropdown = function (grpId) {
            return (new stationGroupService()).$getStationsByGroupId({ key: grpId })
            .then(function (data) {
                $scope.stationsList = [];
                if (data.value.length > 0) {                    
                    angular.forEach(data.value, function (value, key) {
                        $scope.stationsList.push(
                            {
                                value: value.Station.Id,
                                name: value.Station.Name
                            }
                        );
                    });
                    $scope.newEvent.StationId = $scope.stationsList[0].value;
                    $scope.noStations = '';
                } else {
                    $scope.noStations = 'There are no stations for this group.';
                }
                $scope.loading = false;
            });

        }

        $scope.populateParameterFormElements = function (grpId) {       
            //note for these. parameter.requiresSampleDepth is misleading - this means requires sample depth entry on form. for example, surface samples (typically .3, .5, or 1) for sample depth,
            //parameter.requiresSampleDepth is false because it is not required to be entered in field on form (it is an optional dropdown). However, nanitoke is a special case where surface samples
            //can fall outside of .3,.5., or 1 and they only bulk upload
            return (new groupService()).$getByIdNoLabData({ key: grpId })
            .then(function (data) {                
                $scope.parameters = [];
                $scope.parametersNoSampleDepth = [];
                angular.forEach(data.ParameterGroups, function (value, key) {
                    if (value.Parameter.requiresSampleDepth == true) {
                        $scope.parameters.push(value.Parameter);
                    } else {
                        $scope.parametersNoSampleDepth.push(value.Parameter);
                    }
                });
                if ($scope.parameters.length > 0) {
                    angular.forEach($scope.parameters, function (value, key) {                        
                        $scope.newSamples[value.Code + $scope.prmSetIndex] = {};
                        $scope.depths[$scope.prmSetIndex] = {};
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['ProblemId'] = $scope.problemsList[0].value;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['QualifierId'] = $scope.qualifiersList[0].value;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['ParameterId'] = value.Id;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['Matrix'] = value.Matrix;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['requiresSampleDepth'] = value.requiresSampleDepth;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['requiresDuplicate'] = value.requiresDuplicate;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['SampleId'] = 1;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['formIndex'] = $scope.prmSetIndex;
                        $scope.depths[$scope.prmSetIndex]['Depth'] = "";

                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup'] = {};
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['ProblemId'] = $scope.problemsList[0].value;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['QualifierId'] = $scope.qualifiersList[0].value;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['ParameterId'] = value.Id;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['Matrix'] = value.Matrix;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['requiresSampleDepth'] = value.requiresSampleDepth;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['requiresDuplicate'] = value.requiresDuplicate;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['SampleId'] = 2;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['formIndex'] = $scope.prmSetIndex;                        
                        //$scope.newSamples[$scope.prmSetIndex + 'dup']['Depth'] = "";
                    });
                    $scope.noDepthProfileParameters = false;
                } else {
                    $scope.noDepthProfileParameters = true;
                }

                $scope.testNoCal = true;
                
                $scope.testNoDepthIndependent = true;
                if ($scope.parametersNoSampleDepth.length > 0 && $scope.prmSetIndex == 0) {                   
                    angular.forEach($scope.parametersNoSampleDepth, function (value, key) {
                        if (value.isCalibrationParameter == true) {
                            $scope.testNoCal = false;
                            
                        } else {
                            $scope.testNoDepthIndependent = false;
                        }
                        $scope.newSamples[value.Code + $scope.prmSetIndex] = {};
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['ProblemId'] = $scope.problemsList[0].value;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['QualifierId'] = $scope.qualifiersList[0].value;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['ParameterId'] = value.Id;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['Matrix'] = value.Matrix;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['requiresSampleDepth'] = value.requiresSampleDepth;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['requiresDuplicate'] = value.requiresDuplicate;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['SampleId'] = 1;
                        $scope.newSamples[value.Code + $scope.prmSetIndex]['formIndex'] = $scope.prmSetIndex;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup'] = {};
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['ProblemId'] = $scope.problemsList[0].value;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['QualifierId'] = $scope.qualifiersList[0].value;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['ParameterId'] = value.Id;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['Matrix'] = value.Matrix;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['requiresSampleDepth'] = value.requiresSampleDepth;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['SampleId'] = 2;
                        $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['formIndex'] = $scope.prmSetIndex;
                        //$scope.newSamples[$scope.prmSetIndex + 'dup']['Depth'] = "";
                    });
                } 
            });

        }

        $scope.getStations = function (grpId) {
            $scope.grpId = grpId;

            return (new stationGroupService()).$getStationsByGroupId({ key: grpId });
        }
        $scope.getParameters = function () {
            return (new parameterService()).$getAllWithSampleDepth();
        }
        $scope.getUsers = function () {
            return (new userService()).$getActiveUsersInGroup({ key: $scope.grpId });
        }
        $scope.getParametersWoSampleDepth = function () {
            return (new parameterService()).$getAllWithoutSampleDepth();
        }
        $scope.getGroup = function () {
            return (new groupService()).$getById({ key: userGroupId });
        }
        $scope.getGroups = function () {
            return (new groupService()).$getAll();
        }
        $scope.getProblems = function () {
            return (new problemService()).$getAll();
        }
        $scope.getQualifiers = function () {
            return (new qualifierService()).$getAll();
        }

        $scope.getConditions = function () {
            return (new conditionService()).$getAll();
        }

        

        $scope.addParameterSet = function () {
            $scope.prmSetIndex = $scope.prmSetIndex + 1;
            $scope.prmSetIndices.push($scope.prmSetIndex);
            angular.forEach($scope.parameters, function (value, key) {
                $scope.newSamples[value.Code + $scope.prmSetIndex] = {};
                $scope.depths[$scope.prmSetIndex] = {};
                $scope.newSamples[value.Code + $scope.prmSetIndex]['ProblemId'] = $scope.problemsList[0].value;
                $scope.newSamples[value.Code + $scope.prmSetIndex]['QualifierId'] = $scope.qualifiersList[0].value;
                $scope.newSamples[value.Code + $scope.prmSetIndex]['ParameterId'] = value.Id;
                $scope.newSamples[value.Code + $scope.prmSetIndex]['Matrix'] = value.Matrix;
                $scope.newSamples[value.Code + $scope.prmSetIndex]['requiresSampleDepth'] = value.requiresSampleDepth;
                $scope.newSamples[value.Code + $scope.prmSetIndex]['requiresDuplicate'] = value.requiresDuplicate;
                $scope.newSamples[value.Code + $scope.prmSetIndex]['SampleId'] = 1;
                $scope.newSamples[value.Code + $scope.prmSetIndex]['formIndex'] = $scope.prmSetIndex;
                $scope.depths[$scope.prmSetIndex]['Depth'] = "";
                $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup'] = {};
                $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['ProblemId'] = $scope.problemsList[0].value;
                $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['QualifierId'] = $scope.qualifiersList[0].value;
                $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['ParameterId'] = value.Id;
                $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['Matrix'] = value.Matrix;
                $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['requiresSampleDepth'] = value.requiresSampleDepth;
                $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['requiresDuplicate'] = value.requiresDuplicate;
                $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['SampleId'] = 2;
                $scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['formIndex'] = $scope.prmSetIndex;

                //$scope.newSamples[value.Code + $scope.prmSetIndex + 'dup']['Depth'] = "";
            });
        }

        $scope.objectLength = function (object) {
            var length = 0;
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    ++length;
                }
            }
            return length;
        };

        $scope.upload = function (noSamples) {
            $log.log('uploading...')
            angular.forEach($scope.newSamples, function (value, index) {
                if (
                    (typeof $scope.newSamples[index]['Value'] == 'undefined' | $scope.newSamples[index]['Value'] == '') &&
                    (typeof $scope.newSamples[index]['ProblemId'] == 'undefined' | $scope.newSamples[index]['ProblemId'] == null)) {
                    delete $scope.newSamples[index];
                }
            });
            $scope.checkForWarnings().then(function () {
                $log.log()
                var SampleDate = new Date($scope.newEvent.SampleDate);
                SampleDate = SampleDate.getFullYear() + '-' + ("0" + (SampleDate.getMonth() + 1)).slice(-2) + "-" + ("0" + SampleDate.getDate()).slice(-2);
                var SampleTime = $scope.newEvent.SampleTime;

                SampleTime = moment(SampleTime, "h:mm a").format('HH:mm:ss');

                var SampleDateTime = SampleDate + 'T' + SampleTime + 'Z';

                notificationFactory.success('Adding New Samples.', 'Adding Samples', { timeOut: 0, extendedTimeOut: 0 });

                var DateTimeNow = new Date().toJSON();
                var addEvent = {
                    "DateTime": SampleDateTime,
                    "StationId": $scope.newEvent.StationId,
                    "GroupId": $scope.slctGroupId,
                    "CreatedDate": DateTimeNow,
                    "CreatedBy": userId,
                    "ModifiedDate": DateTimeNow,
                    "ModifiedBy": userId,
                    "Comments": $scope.newEvent.Comments
                }
                return (new eventService(addEvent)).$save()
                .then(function (data) {
                    //$scope.newEvent = {};
                    var eventId = data.Id;
                    angular.forEach($scope.conditions, function (value, key) {
                        if (typeof value.Value != 'undefined' & value.Value != '' & value.Value != null) {
                            var addCondition = {
                                "EventId": eventId,
                                "ConditionId": value.Id,
                                "Value": value.Value
                            }
                            return (new eventConditionService(addCondition)).$save();
                        }
                    });

                    angular.forEach($scope.monitors, function (value, key) {
                        if (value.Id !== null && value.Hours !== null) {
                            var addMonitorEvent = {
                                "EventId": eventId,
                                "UserId": value.Id,
                                "Hours": parseFloat(value.Hours),
                                'CreatedDate': DateTimeNow,
                                'CreatedBy': userId,
                                'ModifiedDate': DateTimeNow,
                                'ModifiedBy': userId
                            }
                            return (new monitorLogService(addMonitorEvent)).$save();
                        }
                    });


                    if (!noSamples) {
                        var batchRequest = [];
                        var countBatch = 0;

                        var keys = Object.keys($scope.newSamples);
                        var size = keys.length;
                        $log.log('new samples');
                        $log.log($scope.newSamples);
                        angular.forEach($scope.newSamples, function (value, key) {
                            delete value.formIndex;
                            value['EventId'] = eventId;
                            value['QaFlagId'] = 1;
                            if (value.requiresSampleDepth == 1) {
                                value['Depth'] = parseFloat(value['Depth']);
                            } else if (value.requiresSampleDepth == 0 && value.Matrix == 'Water') {
                                if ($scope.surfaceDepth !== null) {
                                    value['Depth'] = $scope.surfaceDepth;
                                } else {
                                    value['Depth'] = .3;
                                }
                            } else {
                                value['Depth'] = null;
                            }
                            value['Value'] = parseFloat(value['Value']);
                            value['SampleId'] = value['SampleId'];
                            value['ParameterId'] = value['ParameterId'];
                            value['Comments'] = $scope.newEvent.Comments;
                            value['CreatedDate'] = DateTimeNow;
                            value['CreatedBy'] = userId;
                            value['ModifiedDate'] = DateTimeNow;
                            value['ModifiedBy'] = userId;
                            delete value.requiresSampleDepth;
                            delete value.requiresDuplicate;
                            delete value.Matrix;
                            delete value.warning;
                            delete value.warningText;
                            batchRequest.push({ requestUri: "Samples", method: "POST", data: value });
                            countBatch += 1;
                            $log.log('test');
                            $log.log(size);
                            $log.log(countBatch);
                            if (countBatch == size | countBatch == 90) {

                                oData.request({
                                    requestUri: "/odata/$batch",
                                    method: "POST",
                                    data: {
                                        __batchRequests: batchRequest
                                    }
                                }, function (data, response) {
                                    $log.log('response');
                                    $log.log(response);
                                    $log.log(data);
                                    if (countBatch == size) {
                                        notificationFactory.success('Samples added successfully', 'Samples Added!');
                                        //$anchorScroll();
                                        var url = "https://" + $window.location.host + "/Admin/#/samplesAdmin/addConfirmation";
                                        $log.log(url);
                                        $window.location.href = url;
                                    }
                                }, undefined, window.odatajs.oData.batch.batchHandler);
                                if (countBatch == 90) {
                                    countBatch = 0;
                                    batchRequest = [];
                                }
                            }
                        });


                    } else {
                        notificationFactory.success('Samples added successfully', 'Samples Added!');
                        var url = "https://" + $window.location.host + "/Admin/#/samplesAdmin/addConfirmation";
                        $window.location.href = url;
                    }
                });
            });
        }

        $scope.addSamples = function (form) {
            //var addEvent = $scope.newEvent;
            if (form.$valid) {

                angular.forEach($scope.newSamples, function (value, key) {
                    if (typeof value.formIndex !== 'undefined') {
                        var strInt = value.formIndex;
                        if ($scope.objectLength($scope.depths) > 0) {
                            if (typeof $scope.depths[strInt]['Depth'] !== 'undefined' && $scope.depths[strInt]['Depth'] !== '') {
                                value['Depth'] = $scope.depths[strInt]['Depth'];
                            }
                        }
                    }
                });

                var checkDepths = [];
                //check that for each sample that has a value, there is a corresponding depth value. 
                angular.forEach($scope.newSamples, function (value, index) {
                    if ((typeof $scope.newSamples[index]['Value'] !== 'undefined' && $scope.newSamples[index]['Value'] !== '' && $scope.newSamples[index]['Value'] !== null) &&
                        (typeof $scope.newSamples[index]['Depth'] == 'undefined' | $scope.newSamples[index]['Depth'] == '' | $scope.newSamples[index]['Depth'] == null) &&
                        $scope.newSamples[index]['requiresSampleDepth'] == true) {
                        checkDepths.push(1);
                    }
                });
                if (checkDepths.length >0) {
                    $scope.profileDepthError = true;
                    notificationFactory.error('Please check form. It appears in the Depth Profile Section there is a Sample Value without a corresponding depth.',
                        'Something went wrong');
                } else {
                    var countSamples = 0;
                    angular.forEach($scope.newSamples, function (value, index) {
                        if (
                            (typeof $scope.newSamples[index]['Value'] == 'undefined' | $scope.newSamples[index]['Value'] == '') &&
                            (typeof $scope.newSamples[index]['ProblemId'] == 'undefined' | $scope.newSamples[index]['ProblemId'] == null)) {

                        } else {
                            countSamples += 1;
                        }
                    });

                    if (countSamples == 0) {
                        $scope.checkNoSamples().then(function () {
                            $scope.upload(true);
                        })
                    } else {
                        $scope.upload(false);
                    }
                }
               
            } else {
                notificationFactory.error('Please check form for errors', 'Something went wrong');
                form.$pristine = false;
                angular.forEach(form.$error, function (field) {
                    angular.forEach(field, function (errorField) {
                        errorField.$setTouched();
                    })
                });
            }
        }

        $scope.checkValueForWarning = function (sample) {    
            $scope.warnings = [];
            $log.log(sample);//this will give you value of current element
            $log.log('warningss')
            $log.log($scope.warnings)
            $scope.getUpperAndLowerLimits(sample.ParameterId, sample.Value).then(function () {
                if ($scope.warnings.length > 0) {
                    sample.warning = true;
                    sample.warningText = 'The value entered, ' + sample.Value + ' ' + $scope.warnings[0].units + ', is ' + $scope.warnings[0].type +
                        ' the limit for ' + $scope.warnings[0].name + ' of ' + $scope.warnings[0].limit + ' ' + $scope.warnings[0].units + '.';
                } else {
                    sample.warning = false;
                }
            });
        };
        $scope.confirmNoSamples = function () {
            $scope.confirmedNoSamples = true;
        }
        $scope.checkNoSamples = function () {
            var deferred = $q.defer();

            angular.element('#noSamplesModal').modal('show');
            $scope.$watch('confirmedNoSamples', function (newValue, oldValue) {
                if (newValue == true) {
                    deferred.resolve();
                }
            });
            return deferred.promise;
        }

        $scope.checkForWarnings = function () {
            var deferred = $q.defer();
            $scope.checkSamples().then(function () {
                if ($scope.warnings.length > 0) {
                    angular.element('#warningsModal').modal('show');
                    $scope.$watch('confirmedWarnings', function (newValue, oldValue) {
                        $log.log('confirmedWarnings');
                        $log.log(newValue);
                        if (newValue == true) {
                            deferred.resolve();
                        }
                    });
                } else {
                    deferred.resolve();
                }

               
            })
            return deferred.promise;
        }


        $scope.getUpperAndLowerLimits= function(id, value){
            var deferred = $q.defer();
            return (new parameterService()).$getById({ key: id }).then(function (data) {
                if (data.NonfatalUpperRange !== null && typeof (data.NonfatalUpperRange) !== 'undefined') {
                    if (parseFloat(value) > data.NonfatalUpperRange) {
                        $scope.warnings.push(
                            {
                                name: data.Name,
                                value: value,
                                limit: data.NonfatalUpperRange,
                                type: 'above',
                                units: data.Units
                            });
                    }
                }
                if (data.NonfatalNonfatalLowerRange !== null && typeof (data.NonfatalLowerRange) !== 'undefined') {
                    if (parseFloat(value) < data.NonfatalLowerRange) {
                        $scope.warnings.push(
                            {
                                name: data.Name,
                                value: value,
                                limit: data.NonfatalLowerRange,
                                type: 'below',
                                units: data.Units
                            })
                    }
                }
                deferred.resolve();
            });
            return deferred.promise;
        }

        $scope.objectLength = function (object) {
            var length = 0;
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    ++length;
                }
            }
            return length;
        };

        $scope.checkSamples = function () {
            var deferred = $q.defer();            
            var cnt = 0;
            $scope.warnings = [];
            if ($scope.newSamples.length > 0) {
                angular.forEach($scope.newSamples, function (value, key) {
                    $scope.getUpperAndLowerLimits(value.ParameterId, value.Value).then(function () {
                        $log.log('lastSampleChecked');
                        $log.log($scope.newSamples);

                        cnt = cnt + 1;

                        $log.log(cnt);
                        $log.log($scope.objectLength($scope.newSamples));
                        if (cnt == $scope.objectLength($scope.newSamples)) {
                            deferred.resolve();
                        }
                    });
                });
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }

        $scope.confirmWarnings = function () {
            $scope.confirmedWarnings = true;
        }

        $scope.$watch('slctGroupId', function (newValue, oldValue) {           
            if (newValue != null) {
                $scope.prmSetIndex = 0;
                $scope.prmSetIndices = [];
                $scope.groupUsersList = [];
                $scope.monitors = [];
                $scope.prmSetIndices.push($scope.prmSetIndex);
                $scope.populateStationsDropdown(newValue);
                $scope.populateParameterFormElements(newValue);
                $scope.populateUserDropdowns(newValue);
                $scope.checkIfEventExists();
            }            
        });

        $scope.$watch('newEvent.StationId', function (newValue, oldValue) {
            $scope.checkIfEventExists();
        }, true);//add true here to watch for value equality rather than reference equality. important for watchin object property
        
        $scope.$watch('newEvent.SampleTime', function (newValue, oldValue) {
            $scope.checkIfEventExists();
        }, true);//add true here to watch for value equality rather than reference equality. important for watchin object property

        $scope.$watch('newEvent.SampleDate', function (newValue, oldValue) {
            $scope.checkIfEventExists();
        }, true);//add true here to watch for value equality rather than reference equality. important for watchin object property


        $scope.checkIfEventExists = function () {          
            
            if ($scope.newEvent.SampleTime !== null && $scope.newEvent.SampleDate !== null && $scope.slctGroupId !== null && $scope.newEvent.StationId !== null &&
            typeof $scope.newEvent.SampleTime !== 'undefined' && typeof $scope.newEvent.SampleDate !== 'undefined' &&
            typeof $scope.slctGroupId !== 'undefined' && typeof $scope.newEvent.StationId !== 'undefined') {

                var SampleDate = new Date($scope.newEvent.SampleDate);
                SampleDate = SampleDate.getFullYear() + '-' + ("0" + (SampleDate.getMonth() + 1)).slice(-2) + "-" + ("0" + SampleDate.getDate()).slice(-2);
                var SampleTime = $scope.newEvent.SampleTime;

                SampleTime = moment(SampleTime, "h:mm a").format('HH:mm:ss');

                var SampleDateTime = SampleDate + 'T' + SampleTime + 'Z';

                return (new eventService()).$getByGroupStationAndDateTime({ dateTime: SampleDateTime, stationId: $scope.newEvent.StationId, groupId: $scope.slctGroupId })
                .then(function (data) {
                    if (data.value.length > 0) {
                        $scope.addSampleForm.SampleTime.$setValidity('eventExistsError', false)
                        $scope.addSampleForm.SampleDate.$setValidity('eventExistsError', false)
                        $scope.addSampleForm.Group.$setValidity('eventExistsError', false)
                        $scope.addSampleForm.Station.$setValidity('eventExistsError', false)
                    } else {
                        $scope.addSampleForm.SampleTime.$setValidity('eventExistsError', true)
                        $scope.addSampleForm.SampleDate.$setValidity('eventExistsError', true)
                        $scope.addSampleForm.Group.$setValidity('eventExistsError', true)
                        $scope.addSampleForm.Station.$setValidity('eventExistsError', true)

                    }
                })
            }
        }


        $scope.$watch('conditionSetValue', function (newValue, oldValue) {
            $scope.conditionSetArray = [];
            if (newValue != null) {
                if (newValue == 'ALLARM') {
                    $scope.conditionSetArray = ['SF', 'WTHRCT', 'WTHRCY', 'OC', 'WC', 'WCD', 'R', 'R48'];
                }else if(newValue == 'ACB'){
                    $scope.conditionSetArray = ['WS', 'SF', 'WTHRCT', 'TS', 'OC', 'WC', 'WCD', 'R', 'R48', 'OCMNTS'];
                } else {
                    $scope.conditionSetArray = ['WS', 'SF', 'WTHRCT', 'TS', 'OC', 'WC', 'WCD', 'R', 'R48', 'OCMNTS', 'SS',
                    'WNDD','WNDS','WTHRCY','CC','WTHRDBY','WO','WOD'];                    
                }
            }
        });

        $scope.addMonitorEl = function () {
            var emptyMonitor = {
                Id : null,
                Hours : null
            };
            $log.log('empty monitor')
            $log.log(emptyMonitor);
            $scope.monitors.push(emptyMonitor);
            $log.log('monitors');
            $log.log($scope.monitors);
            var intLastMonitor = $scope.monitors.length - 1;
            $log.log(intLastMonitor);

           $scope.monitors[intLastMonitor]['Id'] = $scope.groupUsersList[0].value;
        };

        $scope.clearMonitor = function (monitor) {
            $scope.monitors = $filter('filter')($scope.monitors, function (value, index) { return value.Id !== monitor.Id; });
        }

    };
    samplesAddController.$inject = ['$scope', '$filter', '$log', '$q', '$anchorScroll', 'stationGroupService', 'parameterService',
                                            'eventService', 'sampleService',
                                            'userGroup', 'userGroupId', 'userRole', 'userId', 'userName',
                                            'qualifierService', 'problemService', 'conditionService',
                                            'eventConditionService', 'groupService', 'conditionCategoriesService',
                                            'notificationFactory', 'stationService', 'oData', 'userService',
                                            'monitorLogService',
                                            'leafletMapEvents', 'leafletData', '$timeout','$location','$window'];
    app.controller("samplesAddController", samplesAddController);
}(angular.module("cmcApp")));