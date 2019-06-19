(function (app) {
    var samplesEditController = function ($scope, uiGridConstants, $log, notificationFactory, 
                                    $q, $filter,stationGroupService, parameterService, eventService,
                                    qaFlagService, sampleService, problemService, qualifierService,
                                    conditionService,eventConditionService, conditionCategoriesService,
                                    userGroupId, userRole, userId, userName, userGroup, userService,
                                    groupService,monitorLogService,$window,oData) {

        $scope.initialize = function () {
            jQuery.event.special.touchstart = {
                setup: function (_, ns, handle) {
                    if (ns.includes("noPreventDefault")) {
                        this.addEventListener("touchstart", handle, { passive: false });
                    } else {
                        this.addEventListener("touchstart", handle, { passive: true });
                    }
                }
            };
            $scope.confirmedNoSamples = false;
            $scope.gettingEvents = false;
            $scope.showEditEventBtn = false;
            $scope.downloadClicked = false;
            $scope.editEventLoading = false;
            $scope.editEventLoadingDone = false;
            $scope.loading = true;
            if (userRole === "Monitor") {
                $scope.isMonitor = true;
            } else {
                $scope.isMonitor = false;
            }
            if (userRole === "Coordinator") {
                $scope.isCoordinator = true;
            } else {
                $scope.isCoordinator = false;
            }
            if (userRole === "Coordinator" | userRole === "Monitor") {
                $scope.isMonitorOrCoordinator = true;
            } else {
                $scope.isMonitorOrCoordinator = false;
            }
            
            $scope.confirmedWarnings = false;
            $scope.confirmedPublishWarnings = false;
            $scope.userGroup = userGroup;
            $scope.userName = userName;
            $scope.togglePlot = false;
            $scope.showSelectMsg = false;
            $scope.noDepthProfileParameters = false;
            $scope.editEventSamples = {};
            $scope.editEvent = {};
            $scope.conditions = {};
            $scope.depths = {};
            $scope.hideNoStationForGroup = true;
            $scope.hideNoSamplesForStation = true;
            var promises = [                
                $scope.getStations(userGroupId),
                $scope.getGroups(),
                $scope.getParameters(),
                $scope.getGroup(),
                $scope.getQualifiers(),
                $scope.getProblems(),
                $scope.getQaFlags(),
                $scope.getConditions()
            ]            

            $q.all(promises)
            .then(function (values) {
                $scope.allParameters = [];        
                $scope.stations = values[0].value;
                $scope.stationsList = [];
                angular.forEach($scope.stations, function (value, key) {
                    $scope.stationsList.push(
                        {
                            value: value.Station.Id,
                            name: value.Station.Name
                        }
                      );
                });
                $log.log('stationsList');
                $log.log($scope.stationsList);
                if ($scope.stationsList.length > 1) {
                    $scope.stationId = $scope.stationsList[0].value;
                    $scope.noStations = '';
                } else {
                    $scope.noStations = 'There are no stations for this group.';
                }
                //$scope.editEvent.StationId = $scope.stations[0].Station.Id;

                $scope.surfaceDepthsList = surfaceSampleDepths;
                $scope.surfaceDepth = $scope.surfaceDepthsList[0].value;

                $scope.groupsList = [];
                $scope.groups = values[1].value;
                angular.forEach($scope.groups, function (value, key) {
                    
                    $scope.groupsList.push(
                        {
                            value: value.Id,
                            name: value.Name
                        }
                    );
                });
                
                $scope.slctGroupId = parseInt(userGroupId);
                $scope.userGroupInfo = values[3];
                $scope.coordinatorHasEnhancedPriveledges == false;
                if (userRole == 'Coordinator') {
                    $scope.coordinatorHasEnhancedPriveledges = $scope.userGroupInfo.coordinatorCanPublish;
                }

                $scope.problemsList = [{
                    "name": "",
                    "value": null
                }];
                $scope.qualifiersList = [{
                    "name": "",
                    "value": null
                }];
                $scope.qaFlagsList = [];
                $scope.qaFlagsAllList = [{
                    "name": "",
                    "value": null
                }];
                $scope.qaFlagsAllList.push(
                    {
                        name: "Set All Samples to Uploaded",
                        value: 1
                    }
                );
                if (userRole !== "Coordinator" && userRole !== "Monitor") {
                    $scope.qaFlagsAllList.push({
                        name: "Set All Samples to Published",
                        value: 2
                    });
                }
                $scope.qaFlagsAllId = $scope.qaFlagsAllList[0].value;
                $scope.problems = values[5].value;
                angular.forEach($scope.problems, function (value, key) {
                    $scope.problemsList.push(
                        {
                            value: value.Id,
                            name: value.Code + ' - ' + value.ApplicationText
                        }
                    );
                });
                $scope.qualifiers = values[4].value;
                angular.forEach($scope.qualifiers, function (value, key) {
                    $scope.qualifiersList.push(
                        {
                            value: value.Id,
                            name: value.Code
                        }
                    );
                });
                $scope.qaFlags = values[6].value;
                angular.forEach($scope.qaFlags, function (value, key) {
                    $scope.qaFlagsList.push(
                        {
                            value: value.Id,
                            name: value.Description
                        }
                    );
                });
                $scope.conditions = values[7].value;
                $scope.setupConditionDropdowns();
                

                $scope.allParameters = values[2].value;
            });
        };

       
       
        $scope.getStations = function (grpId) {
            return (new stationGroupService()).$getStationsByGroupId({ key: grpId });
        }
        $scope.getParameters = function () {
            return (new parameterService()).$getAll();
        }

        $scope.getGroup = function () {
            return (new groupService()).$getById({ key: userGroupId });
        }
        $scope.getGroups = function () {
            return (new groupService()).$getAllLessDetail();
        }
       
        $scope.getSamples = function (id) {
            if (userRole == 'Monitor') {
                return (new sampleService()).$getByStationIdAndCreatedById({
                    stationId: id,
                    userId: userId
                }).then(function (data) {
                    $scope.samples = data.value;
                    
                    if ($scope.samples.length > 0) {
                        $scope.hideNoSamplesForStation = true;
                        $scope.fillGrid(id);
                        
                        
                    } else {
                        $scope.hideNoSamplesForStation = false;
                        $scope.fillGrid(id);
                        
                    }
                })
            } else if (userRole == 'Coordinator') {
                return (new sampleService()).$getByStationIdAndGroupId({
                    stationId: id,
                    groupId: userGroupId
                }).then(function (data) {
                    $scope.samples = data.value;
                    if ($scope.samples.length > 0) {
                        $scope.hideNoSamplesForStation = true;
                        $scope.fillGrid(id);
                    } else {
                        $scope.hideNoSamplesForStation = false;
                        $scope.fillGrid(id);
                    }
                })
            } else {
                return (new sampleService()).$getByStationId({
                    stationId: id
                }).then(function (data) {
                    $scope.samples = data.value;
                    $log.log('samples');
                    $log.log($scope.samples);
                    if ($scope.samples.length > 0) {
                        $scope.hideNoSamplesForStation = true;
                        $scope.fillGrid(id);
                    } else {
                        $scope.hideNoSamplesForStation = false;
                        $scope.fillGrid(id);
                    }
                })
               
            }
            
        };

        $scope.getPlot = function () {
            $scope.togglePlot = !$scope.togglePlot;
            $scope.getPlotParameters();
            if ($scope.plotParameters.length > 0) {
                $scope.getPlotData($scope.plotParameters[0].id);
            }
        }

        $scope.getProblems = function () {
            return (new problemService()).$getAll();
        }
        $scope.getQualifiers = function () {
            return (new qualifierService()).$getAll();
        }
        $scope.getQaFlags = function () {
            return (new qaFlagService()).$getAll();
        }
        $scope.getConditions = function () {
            return (new conditionService()).$getAll();
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
                                 
        $scope.getEventConditionsByEventId = function (eventId) {  
            $scope.editCondition = {};
            angular.forEach($scope.conditions, function (value, key) {
                $scope.editCondition[value.Id] = {};
                $scope.editCondition[value.Id]['Value'] = null;
                $scope.editCondition[value.Id]['ConditionId'] = value.Id;
                $scope.editCondition[value.Id]['EventId'] = eventId;
            });
            return (new eventConditionService()).$getByEventId({ 'key': eventId })            
            .then(function (data) {
                angular.forEach(data.value, function (value, key) {
                    $scope.editCondition[value.ConditionId]['Value'] = value.Value;
                    $scope.editCondition[value.ConditionId]['EventConditionId'] = value.Id;
                    $scope.editCondition[value.ConditionId]['ConditionId'] = value.ConditionId;
                    $scope.editCondition[value.ConditionId]['EventId'] = value.EventId;
                });
            });
        }

        $scope.formCsv = function (data) {
            var allSamples = data;
            var samplesForDownload = [{
                'Source': 'Source',
                'Station': 'Station',
                'Date': 'Date',
                'Time': 'Time',
                'SampleDepth': 'SampleDepth',
                'SampleId': 'SampleId',
                'ParameterType': 'ParameterType',
                'ParameterName': 'ParameterName',
                'Value': 'Value',
                'Qualifier': 'Qualifier',
                'Problem': 'Problem',
                'Comments': 'Comments'
            }];

            var events = [];
            angular.forEach(allSamples, function (v, k) {
                var qual;
                var prob;
                if (v.Qualifier == null) {
                    qual = null;
                } else {
                    qual = v.Qualifier.Code;
                }
                if (v.Problem == null) {
                    prob = null;
                } else {
                    prob = v.Problem.Code;
                }
                var smp = {
                    'Source': v.Event.Group.Code,
                    'Station': v.Event.Station.Code,
                    'Date': v.Event.DateTime.substring(0, 10),
                    'Time': v.Event.DateTime.substring(11, 19),
                    'SampleDepth': v.Depth,
                    'SampleId': v.SampleId,
                    'ParameterType': 'WaterQuality',
                    'ParameterName': v.Parameter.Code,
                    'Value': v.Value,
                    'Qualifier': qual,
                    'Problem': prob,
                    'Comments': v.Comments
                }
                if (events.indexOf(v.Event.Id) == -1) {
                    events.push(v.Event.Id);
                    angular.forEach(v.Event.EventConditions, function (val, ind) {
                        var condition = {};
                        condition.Source = v.Event.Group.Code,
                        condition.Station = v.Event.Station.Code,
                        condition.Date = v.Event.DateTime.substring(0, 10),
                        condition.Time = v.Event.DateTime.substring(11, 19)
                        condition.SampleDepth = null;
                        condition.SampleId = null;
                        condition.ParameterType = 'Condition';
                        condition.ParameterName = val.Condition.Code,
                        condition.Value = val.Value,
                        condition.Qualifier = null;
                        condition.Problem = null;
                        condition.Comments = v.Comments;
                        samplesForDownload.push(condition);
                    });
                    angular.forEach(v.Event.MonitorLogs, function (val, ind) {
                        var monitor = {};
                        monitor.Source = v.Event.Group.Code,
                        monitor.Station = v.Event.Station.Code,
                        monitor.Date = v.Event.DateTime.substring(0, 10),
                        monitor.Time = v.Event.DateTime.substring(11, 19)
                        monitor.SampleDepth = null;
                        monitor.SampleId = null;
                        monitor.ParameterType = 'Monitor';
                        monitor.ParameterName = val.ApplicationUser.Code,
                        monitor.Value = val.Hours,
                        monitor.Qualifier = null;
                        monitor.Problem = null;
                        monitor.Comments = v.Comments;
                        samplesForDownload.push(monitor);
                    });
                }
                samplesForDownload.push(smp);
            })
            $scope.downloadClicked = false;
            return samplesForDownload;
        }

        $scope.getDataForDownload = function () {
            $scope.downloadClicked = true;
            var deferred = $q.defer();
            if (userRole == 'Coordinator') {
                (new sampleService()).$getDataDownloadCoordinator({ 'stationId': $scope.stationId, 'groupId': userGroupId })
                .then(function (data) {
                    deferred.resolve($scope.formCsv(data.value));
                });
            } else if (userRole == 'Monitor') {
                (new sampleService()).$getDataDownloadMonitor({ 'stationId': $scope.stationId, 'userId': userId })
                .then(function (data) {
                    deferred.resolve($scope.formCsv(data.value));
                });
            } else {
                (new sampleService()).$getDataDownloadOfficer({ 'stationId': $scope.stationId, 'groupId': $scope.groupId })
                .then(function (data) {
                    deferred.resolve($scope.formCsv(data.value));
                });
            }
            return deferred.promise;
        }

        $scope.isEmptyObject = function (obj) {
            return angular.equals(obj, {});
        };

        $scope.$watch('qaFlagsAllId', function (newValue, oldValue) {
            if (newValue !== null) {
                angular.forEach($scope.editSample, function (value, key) {
                    value.QaFlagId = newValue;
                });
            }
          
        });

        $scope.$watch('slctGroupId', function (newValue, oldValue) {
            $scope.hideNoSamplesForStation = true;
            $scope.hideNoStationForGroup = true;
            if (newValue != null) {
                $scope.monitors = [];
                $scope.populateStationsDropdown(newValue);
                //$scope.populateUserDropdowns(newValue);
                $scope.editEventLoadingDone = false;
                $scope.editEventLoading = false;
                $scope.togglePlot = false;
            }
        });

        $scope.refreshGrid = function () {
            $scope.monitors = [];
            $scope.populateStationsDropdown($scope.slctGroupId);
            //$scope.populateUserDropdowns(slctGroupId);
        }

        $scope.populateUserDropdowns = function (grpIds) {

            $scope.groupUsersList = [{
                value: null,
                name: ""
            }];
            angular.forEach(grpIds, function (v, k) {
                $log.log('v');
                $log.log(grpIds)
                $log.log(v);
                return (new userService()).$getActiveUsersInGroup({ key: v }).then(function (v, k) {
                    var users = v.value;
                    

                    angular.forEach(users, function (value, key) {
                        $scope.groupUsersList.push(
                            {
                                value: value.Id,
                                name: value.FirstName + ' ' + value.LastName
                            }
                          );
                    });

                });
            });            
        }

        $scope.addMonitorEl = function () {
            var emptyMonitor = {
                Id: null,
                Hours: null
            };
            $scope.monitors.push(emptyMonitor);
            var intLastMonitor = $scope.monitors.length - 1;

            $scope.monitors[intLastMonitor]['Id'] = $scope.groupUsersList[0].value;

           

        };

        $scope.$watch('stationId', function (newValue, oldValue) {
            $scope.gettingEvents = true;
            $scope.hideNoSamplesForStation = true;
            $scope.hideNoStationForGroup = true;
            if (newValue != null) {
                $scope.samples = [];
                $scope.getSamples(newValue);
                $scope.getPlotParameters();
                $scope.editEventLoadingDone = false;
                $scope.editEventLoading = false;
                $scope.togglePlot = false;
            }
        });
        

        $scope.populateStationsDropdown = function (grpId) {
            return (new stationGroupService()).$getStationsByGroupId({ key: grpId })
            .then(function (data) {
                if (data.value.length > 0) {
                    $scope.hideNoStationForGroup = true;
                    $scope.stationsList = [];
                    angular.forEach(data.value, function (value, key) {
                        $scope.stationsList.push(
                            {
                                value: value.Station.Id,
                                name: value.Station.Name
                            }
                        );
                    });
                    $scope.stationId = $scope.stationsList[0].value;
                    //$scope.stationChanged();
                } else {
                    $scope.hideNoStationForGroup = false;
                    $scope.noStations = 'Oh no! There are no stations for this group.';
                }
            });

        }
        $scope.populateParameterFormElements = function (grpId) {
            //note for these. parameter.requiresSampleDepth is misleading - this means requires sample depth entry on form. for example, surface samples (typically .3, .5, or 1) for sample depth,
            //parameter.requiresSampleDepth is false because it is not required to be entered in field on form (it is an optional dropdown). However, nanitoke is a special case where surface samples
            //can fall outside of .3,.5., or 1 and they only bulk upload
            $scope.editEventLoading = true;
            $scope.editEventLoadingDone = false;
            $scope.editSample = {};
            return (new groupService()).$getById({ key: grpId })
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
                        $scope.editSample[value.Code + $scope.prmSetIndex] = {};
                        $scope.depths[$scope.prmSetIndex] = {};
                        $scope.editSample[value.Code + $scope.prmSetIndex]['Value'] = null;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['ProblemId'] = $scope.problemsList[0].value;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['QualifierId'] = $scope.qualifiersList[0].value;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['QaFlagId'] = $scope.qaFlagsList[0].value;;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['ParameterId'] = value.Id;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['Matrix'] = value.Matrix;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['requiresSampleDepth'] = value.requiresSampleDepth;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['requiresDuplicate'] = value.requiresDuplicate;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['isCalibration'] = value.isCalibrationParameter;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['SampleId'] = 1;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['formIndex'] = $scope.prmSetIndex;
                        $scope.depths[$scope.prmSetIndex]['Depth'] = "";
                        
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup'] = {};
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['Value'] = null;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['ProblemId'] = $scope.problemsList[0].value;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['QualifierId'] = $scope.qualifiersList[0].value;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['QaFlagId'] = $scope.qaFlagsList[0].value;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['ParameterId'] = value.Id;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['Matrix'] = value.Matrix;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['requiresSampleDepth'] = value.requiresSampleDepth;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['requiresDuplicate'] = value.requiresDuplicate;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['isCalibration'] = value.isCalibrationParameter;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['SampleId'] = 2;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['formIndex'] = $scope.prmSetIndex;
                    });
                    $scope.noParameters = '';
                    $scope.noDepthProfileParameters = false;
                } else {
                    $scope.noParameters = 'There are no parameters for this group.';
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
                        $scope.editSample[value.Code + $scope.prmSetIndex] = {};
                        $scope.editSample[value.Code + $scope.prmSetIndex]['Value'] = null;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['ProblemId'] = $scope.problemsList[0].value;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['QualifierId'] = $scope.qualifiersList[0].value;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['QaFlagId'] = $scope.qaFlagsList[0].value;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['ParameterId'] = value.Id;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['Matrix'] = value.Matrix;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['requiresSampleDepth'] = value.requiresSampleDepth;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['requiresDuplicate'] = value.requiresDuplicate;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['isCalibration'] = value.isCalibrationParameter;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['SampleId'] = 1;
                        $scope.editSample[value.Code + $scope.prmSetIndex]['formIndex'] = $scope.prmSetIndex;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup'] = {};
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['Value'] = null;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['ProblemId'] = $scope.problemsList[0].value;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['QualifierId'] = $scope.qualifiersList[0].value;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['QaFlagId'] = $scope.qaFlagsList[0].value;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['ParameterId'] = value.Id;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['Matrix'] = value.Matrix;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['requiresSampleDepth'] = value.requiresSampleDepth;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['requiresDuplicate'] = value.requiresDuplicate;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['isCalibration'] = value.isCalibrationParameter;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['SampleId'] = 2;
                        $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['formIndex'] = $scope.prmSetIndex;
                    });
                    
                }
                $scope.getEditSample();
                $scope.editEventLoadingDone = true;
                $scope.editEventLoading = false;
            });
           

        }
        $scope.addParameterSet = function () {
            //$scope.editSample = {};           
            $scope.prmSetIndex = $scope.prmSetIndex + 1;
            $scope.prmSetIndices.push($scope.prmSetIndex);
            angular.forEach($scope.parameters, function (value, key) {                                
                $scope.depths[$scope.prmSetIndex] = {};
                $scope.editSample[value.Code + $scope.prmSetIndex] = {};
                $scope.editSample[value.Code + $scope.prmSetIndex]['Value'] = null;
                $scope.editSample[value.Code + $scope.prmSetIndex]['ProblemId'] = $scope.problemsList[0].value;
                $scope.editSample[value.Code + $scope.prmSetIndex]['QualifierId'] = $scope.qualifiersList[0].value;
                $scope.editSample[value.Code + $scope.prmSetIndex]['QaFlagId'] = $scope.qaFlagsList[0].value;
                $scope.editSample[value.Code + $scope.prmSetIndex]['ParameterId'] = value.Id;
                $scope.editSample[value.Code + $scope.prmSetIndex]['SampleId'] = 1;
                $scope.editSample[value.Code + $scope.prmSetIndex]['formIndex'] = $scope.prmSetIndex;
                $scope.editSample[value.Code + $scope.prmSetIndex]['Matrix'] = value.Matrix;
                $scope.editSample[value.Code + $scope.prmSetIndex]['requiresSampleDepth'] = value.requiresSampleDepth;
                $scope.editSample[value.Code + $scope.prmSetIndex]['requiresDuplicate'] = value.requiresDuplicate;
                $scope.editSample[value.Code + $scope.prmSetIndex]['isCalibration'] = value.isCalibrationParameter;
                $scope.depths[$scope.prmSetIndex]['Depth'] = "";
                $scope.editSample[value.Code + $scope.prmSetIndex + 'dup'] = {};
                $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['Value'] = null;
                $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['ProblemId'] = $scope.problemsList[0].value;
                $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['QualifierId'] = $scope.qualifiersList[0].value;
                $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['QaFlagId'] = $scope.qaFlagsList[0].value;
                $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['ParameterId'] = value.Id;
                $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['SampleId'] = 2;
                $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['formIndex'] = $scope.prmSetIndex;
                $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['Matrix'] = value.Matrix;
                $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['requiresSampleDepth'] = value.requiresSampleDepth;
                $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['requiresDuplicate'] = value.requiresDuplicate;
                $scope.editSample[value.Code + $scope.prmSetIndex + 'dup']['isCalibration'] = value.isCalibrationParameter;
            });
        }
        $scope.fillGrid = function (stationId) {
            var gridOptions = {};

            function generateColumns() {                
                gridOptions.columnDefs.push(
                    {
                        field: 'Station',
                        name: 'Station',
                    }
                );
                gridOptions.columnDefs.push(
                    {
                        field: 'DateTime',
                        name: 'Sample Time',
                        cellTemplate: '<span> {{row.entity.DateTime | date:\'MM/dd/yyyy hh:mm a\':\'UTC\'}}</span>'
                    }
                );
                gridOptions.columnDefs.push(
                    {
                        field: 'Id',
                        name: 'Id',
                        visible: false
                    }
                );
                gridOptions.columnDefs.push(
                    {
                        field: 'Group',
                        name: 'Group'
                    }
                );
                gridOptions.columnDefs.push(
                    {
                        field: 'PublishedStatus',
                        name: 'Samples to Publish'
                    }
                );
                $scope.loading = false;
            }

            function generateData() {
                var plotThisId = 0;
                var uniqueEvents = [];
                var uniqueObj = [];
                var groupIds = [];
                var events = [];
                for (let i = 0; i < $scope.samples.length; i++) {
                    if (uniqueEvents.indexOf($scope.samples[i].Event.Id) === -1) {
                        uniqueObj.push($scope.samples[i])
                        uniqueEvents.push($scope.samples[i].Event.Id);
                    }

                }
                $log.log('uniqueEvents');
                $log.log(uniqueEvents);

                (new eventService()).$getByStationId({
                    stationId: stationId
                }).then(function (data) {
                    events = data.value;
                    $log.log('events');
                    $log.log(events);

                    angular.forEach(events, function (value, key) {
                        if (uniqueEvents.indexOf(value.Id) == -1) {
                            uniqueEvents.push(value.Id);
                        }
                    });
                    angular.forEach(uniqueEvents, function (value, key) {
                        var samples = $filter('filter')($scope.samples, {
                            Event: {
                                Id: value
                            }
                        });
                        $log.log('1');
                        $log.log(samples);
                        var datetime, station, group, id, publishedStatus;

                        if (samples.length > 0) {
                            datetime = samples[0].Event.DateTime;
                            station = samples[0].Event.Station.Name;
                            group = samples[0].Event.Group.Name;
                            if (groupIds.indexOf(samples[0].Event.Group.Id) == -1) {
                                groupIds.push(samples[0].Event.Group.Id);
                            }

                            id = samples[0].Event.Id;
                            plotThisId = samples[0].ParameterId;
                            var cnt1 = 0;
                            var cnt2 = 0;
                            angular.forEach(samples, function (value, key) {
                                if (value.QaFlagId == 1) {
                                    cnt1 = cnt1 + 1
                                } else if (value.QaFlagId == 2) {
                                    cnt2 = cnt2 + 1
                                }
                            });

                            publishedStatus = cnt1;
                        } else {
                            angular.forEach(events, function (v, k) {
                                if (v.Id == value) {
                                    datetime = v.DateTime;
                                    station = v.Station.Name;
                                    group = v.Group.Name;
                                    id = v.Id;
                                    publishedStatus = 0;
                                }

                            });
                        }
                        //var verifiedStatus = cnt1;


                        var row = {};
                        angular.forEach(gridOptions.columnDefs, function (v, k) {
                            if (v.field == 'DateTime') {
                                row[v.field] = datetime;
                            } else if (v.field == 'Station') {
                                row[v.field] = station;
                            } else if (v.field == 'Group') {
                                row[v.field] = group;
                            } else if (v.field == 'Id') {
                                row[v.field] = id;
                            } else if (v.field == 'PublishedStatus') {
                                row[v.field] = publishedStatus;
                            }
                        });
                        gridOptions.data.push(row);
                    });
                    //$scope.getPlotData(plotThisId);
                    //$scope.fillPlot();

                    $scope.populateUserDropdowns(groupIds);
                });
            }
            function createGridOptions() {
                gridOptions = {
                    enableFiltering:true,
                    enableSorting: true,
                    fastWatch: true,
                    enableRowSelection: true,
                    enableSelectAll: true,
                    multiSelect: true,
                    columnDefs: [],
                    data: []
                };
                generateColumns();
                generateData();

                $scope.gridOptions = gridOptions;
                for (var i = 0; i < $scope.gridOptions.columnDefs.length; i++) {
                    $scope.gridOptions.columnDefs[i].width = '200';
                }
                $scope.gettingEvents = false;
            }
            createGridOptions();
            $scope.gridOptions.onRegisterApi = function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function (eRow) {
                    var row = $scope.gridApi.selection.getSelectedRows();
                    if (row.length == 1) {
                        $scope.row = row;
                        $scope.showEditEventBtn = true;                        
                    } else {
                        $scope.row = null;
                        $scope.editEvent = {};
                        $scope.editSample = {};
                        $scope.showEditEventBtn = false;
                        $scope.showSelectMsg = false;
                        $scope.editEventLoadingDone = false;
                        $scope.editEventLoading = false;
                    }
                });
                
            };
            $scope.filterGrid = function (value) {               
                $scope.gridApi.grid.columns[5].filters[0] =
                    {
                        condition: uiGridConstants.filter.GREATER_THAN,
                        term: value
                    }
                $scope.gridApi.grid.sortColumn($scope.gridApi.grid.columns[5], uiGridConstants.DESC, true)
            };
            $scope.filterGridByPublish = function (value) {
                $scope.gridApi.grid.columns[6].filters[0] =
                    {
                        condition: uiGridConstants.filter.GREATER_THAN,
                        term: value
                    }
                $scope.gridApi.grid.sortColumn($scope.gridApi.grid.columns[6], uiGridConstants.DESC, true)
            };
            $scope.clearFilterGrid = function () {
                $scope.gridApi.grid.clearAllFilters();
            };
        }
       
        $scope.getSelectedEvent = function (row) {
           
            if (typeof row[0] !== 'undefined') {
                
                $scope.showSelectMsg = true;
                var id = row[0].Id;
                return (new sampleService()).$getByEventId({
                    eventId: id
                }).then(function (data) {
                    if (data.value.length > 0) {
                        $scope.editEventSamples = data.value;
                        $scope.getEditEvent();
                       
                    } else {
                        (new eventService()).$getByEventIdAndExpand({
                            eventId: id
                        }).then(function (data) {
                            $log.log('returned');
                            $log.log(data);
                            $scope.editEventSamples = data.value;

                            $scope.getEditEvent();
                        });
                    }
                    $scope.getEventConditionsByEventId(id);
                    $scope.getMonitorLogsByEventId(id);
                })
            };
        }

        $scope.getMonitorLogsByEventId = function (eventId) {
            $scope.monitors = [];
            return (new monitorLogService()).$getByEventId({ 'key': eventId })            
            .then(function (data) {
                angular.forEach(data.value,function(v,k){
                    var monitor = {
                        Id : v.UserId,
                        Hours: v.Hours,
                        MonitorLogId: v.Id
                    };


                    $scope.monitors.push(monitor);
                });
            });
        }

        $scope.clearMonitor = function (monitor) {
            
           
            if (typeof (monitor.MonitorLogId) !== 'undefined') {
                (new monitorLogService()).$remove({ key: monitor.MonitorLogId }).then(function () {
                    $scope.monitors = $filter('filter')($scope.monitors, function (value, index) { return value.MonitorLogId !== monitor.MonitorLogId; });
                })
            } else {
                $scope.monitors = $filter('filter')($scope.monitors, function (value, index) { return value.Id !== monitor.Id; });
            }
        }

        $scope.getEditEvent = function () {
            $scope.editEvent = {};
            var event;
            if (typeof ($scope.editEventSamples[0].Event) !== 'undefined') {
                event = $scope.editEventSamples[0].Event
            } else {
                $log.log('test');
                event = $scope.editEventSamples[0];
            }
            $log.log('eveentttt')
            $log.log(event);
            $scope.editEvent.EventId = event.Id;

            $scope.editEvent.SampleDate = moment(event.DateTime.substring(0, 10));
            $scope.sampleDateInit = moment(event.DateTime.substring(0, 10));
            $scope.editEvent.SampleTime = event.DateTime.substring(11, 22);
            $scope.sampleDateInit = new Date($scope.editEvent.SampleDate);
            $scope.sampleDateInit = $scope.sampleDateInit.getFullYear() + '-' + ("0" + ($scope.sampleDateInit.getMonth() + 1)).slice(-2) + "-" + ("0" + $scope.sampleDateInit.getDate()).slice(-2);
            $scope.sampleTimeInit = $scope.editEvent.SampleTime;

            $scope.sampleTimeInit = moment($scope.sampleTimeInit, "h:mm a").format('HH:mm:ss');

            $scope.sampleDateTimeInit = $scope.sampleDateInit + 'T' + $scope.sampleTimeInit + 'Z';

            $scope.editEvent.GroupId = event.Group.Id;
            $scope.editEvent.GroupName = event.Group.Name;
            $scope.editEvent.StationId = event.Station.Id;
            $scope.stationIdInit = event.Station.Id;
            $scope.editEvent.StationName = event.Station.Name;
            $scope.editEvent.Comments = event.Comments;
            $scope.prmSetIndex = 0;
            $scope.prmSetIndices = [];
            $scope.prmSetIndices.push($scope.prmSetIndex);
            $scope.populateParameterFormElements($scope.editEvent.GroupId);
            $scope.editEventDateText = $scope.editEvent.SampleDate.format('MM/DD/YY');
            return (new userService()).$getByUserId({ key: event.CreatedBy })
                    .then(function (data) {
                        $scope.editEventCreatedBy = data.value[0].FirstName + ' ' + data.value[0].LastName;
                        $scope.editEventCreatedByEmail = data.value[0].Email;
                    });
            
            
        };

        $scope.addEventSample = function (v) {
            if (v.SampleId === 1) {
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['Value'] = v.Value;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['ProblemId'] = v.ProblemId;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['QualifierId'] = v.QualifierId;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['ParameterId'] = v.ParameterId;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['SampleId'] = v.SampleId;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['QaFlagId'] = v.QaFlagId;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['Id'] = v.Id;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['formIndex'] = $scope.prmSetIndex;
                if ($scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['Value'] !== null) {
                    $scope.checkValueForWarning($scope.editSample[v.Parameter.Code + $scope.prmSetIndex]);
                }
            } else if (v.SampleId === 2) {
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['Value'] = v.Value;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['ProblemId'] = v.ProblemId;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['QualifierId'] = v.QualifierId;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['ParameterId'] = v.ParameterId;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['QaFlagId'] = v.QaFlagId;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['SampleId'] = v.SampleId;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['Id'] = v.Id;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['formIndex'] = $scope.prmSetIndex;
                $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['dupExists'] = true;
                if ($scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['Value'] !== null) {
                    $scope.checkValueForWarning($scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']);
                }
            }
        }

        $scope.getEditSample = function () {
            if ($scope.editEventSamples.length > 1) {
                var sortedEventSamples = $scope.editEventSamples.sort(function (a, b) { return (a.Depth > b.Depth) ? 1 : ((b.Depth > a.Depth) ? -1 : 0); });
            } else {
                var sortedEventSamples = $scope.editEventSamples;
            }
            
            sortedEventSamples.forEach(function (v, k) {
                if (typeof (v.Parameter) !== 'undefined') {
                    if (v.Parameter.requiresSampleDepth == 1) {
                        if ($scope.depths[$scope.prmSetIndex]['Depth'] == "") {
                            $scope.depths[$scope.prmSetIndex]['Depth'] = v.Depth;
                        } else if (v.Depth != $scope.depths[$scope.prmSetIndex]['Depth']) {
                            $scope.addParameterSet();
                            $scope.depths[$scope.prmSetIndex]['Depth'] = v.Depth;
                        }

                        if (typeof ($scope.editSample[v.Parameter.Code + $scope.prmSetIndex]) === 'undefined' |
                            typeof ($scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']) === 'undefined') {
                            var newParam = {};
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex] = {};
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['groupParamWarning'] = true;


                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['Value'] = null;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['ProblemId'] = $scope.problemsList[0].value;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['QualifierId'] = $scope.qualifiersList[0].value;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['QaFlagId'] = $scope.qaFlagsList[0].value;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['ParameterId'] = v.Parameter.Id;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['Matrix'] = v.Parameter.Matrix;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['requiresSampleDepth'] = v.Parameter.requiresSampleDepth;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['requiresDuplicate'] = v.Parameter.requiresDuplicate;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['isCalibration'] = v.Parameter.isCalibrationParameter;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['SampleId'] = 1;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['formIndex'] = $scope.prmSetIndex;

                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup'] = {};
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['Value'] = null;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['ProblemId'] = $scope.problemsList[0].value;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['QualifierId'] = $scope.qualifiersList[0].value;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['QaFlagId'] = $scope.qaFlagsList[0].value;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['ParameterId'] = v.Parameter.Id;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['Matrix'] = v.Parameter.Matrix;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['requiresSampleDepth'] = v.Parameter.requiresSampleDepth;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['requiresDuplicate'] = v.Parameter.requiresDuplicate;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['isCalibration'] = v.Parameter.isCalibrationParameter;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['SampleId'] = 2;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['formIndex'] = $scope.prmSetIndex;

                            $scope.addEventSample(v);
                            $scope.allParameters.forEach(function (value, key) {
                                if (value.Id == v.Parameter.Id) {

                                    if (v.Parameter.requiresSampleDepth == false) {
                                        $scope.parametersNoSampleDepth.push(value);
                                        if (value.isCalibrationParameter == true) {
                                            $scope.testNoCal = false;
                                        } else {
                                            $scope.testNoDepthIndependent = false;
                                        }
                                    } else {
                                        $scope.parameters.push(value);
                                    }
                                }
                            });
                            //return (new parameterService()).$getById({ key: v.Parameter.Id }).then(function (data) {
                            //    newParam = data;
                            //    $scope.parameters.push(newParam);
                            //});
                        } else {
                            $scope.addEventSample(v);
                        }
                    } else if (v.Parameter.requiresSampleDepth == 0 & $scope.prmSetIndex == 0) {
                        if ((typeof ($scope.editSample[v.Parameter.Code + $scope.prmSetIndex]) === 'undefined' ||
                                typeof ($scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']) === 'undefined')
                                ) {
                            var newParam = {};

                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex] = {};
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['groupParamWarning'] = true;

                            //load empty parameter not in group for dup 1
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['Value'] = null;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['ProblemId'] = $scope.problemsList[0].value;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['QualifierId'] = $scope.qualifiersList[0].value;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['QaFlagId'] = $scope.qaFlagsList[0].value;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['ParameterId'] = v.Parameter.Id;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['Matrix'] = v.Parameter.Matrix;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['requiresSampleDepth'] = v.Parameter.requiresSampleDepth;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['requiresDuplicate'] = v.Parameter.requiresDuplicate;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['isCalibration'] = v.Parameter.isCalibrationParameter;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['SampleId'] = 1;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex]['formIndex'] = $scope.prmSetIndex;
                            //load empty parameter not in group for dup 2
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup'] = {};
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['Value'] = null;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['ProblemId'] = $scope.problemsList[0].value;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['QualifierId'] = $scope.qualifiersList[0].value;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['QaFlagId'] = $scope.qaFlagsList[0].value;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['ParameterId'] = v.Parameter.Id;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['Matrix'] = v.Parameter.Matrix;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['requiresSampleDepth'] = v.Parameter.requiresSampleDepth;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['requiresDuplicate'] = v.Parameter.requiresDuplicate;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['isCalibration'] = v.Parameter.isCalibrationParameter;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['SampleId'] = 2;
                            $scope.editSample[v.Parameter.Code + $scope.prmSetIndex + 'dup']['formIndex'] = $scope.prmSetIndex;

                            $scope.addEventSample(v);
                            $scope.allParameters.forEach(function (value, key) {
                                if (value.Id == v.Parameter.Id) {

                                    if (v.Parameter.requiresSampleDepth == false) {
                                        $scope.parametersNoSampleDepth.push(value);
                                        if (value.isCalibrationParameter == true) {
                                            $scope.testNoCal = false;
                                        } else {
                                            $scope.testNoDepthIndependent = false;
                                        }
                                    } else {
                                        $scope.parameters.push(value);
                                    }
                                }
                            });
                            //return (new parameterService()).$getById({ key: v.Parameter.Id }).then(function (data) {
                            //    newParam = data;
                            //    $scope.parametersNoSampleDepth.push(newParam);
                            //});
                        } else {
                            $scope.addEventSample(v);
                        }
                    }
                }
            });
            $scope.editEventLoadingDone = true;
            $scope.editEventLoading = false;
        };
        $scope.objectLength = function (object) {
            var length = 0;
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    ++length;
                }
            }
            return length;
        };

        $scope.checkForPublish = function (ind, isDepthRequired) {
            var somethingIsPublished = false;
            if ($scope.isMonitorOrCoordinator && !($scope.isCoordinator && $scope.coordinatorHasEnhancedPriveledges)) {
                angular.forEach($scope.editSample, function (v, k) {
                    if (!somethingIsPublished) {
                        if (isDepthRequired) {
                            if (v.requiresSampleDepth == isDepthRequired && v.QaFlagId == 2 && v.formIndex == ind) {
                                somethingIsPublished = true;
                            }
                        } else {
                            if (v.requiresSampleDepth == isDepthRequired && v.QaFlagId == 2 && !v.isCalibration) {
                                somethingIsPublished = true;
                            }
                        }
                    }
                });
            }
            return somethingIsPublished;
        }

        $scope.checkValueForWarning = function (sample) {
            $scope.getUpperAndLowerLimits(sample.ParameterId, sample.Value).then(function (data) {
                if (data.length > 0) {
                    sample.warning = true;
                    sample.warningText = 'The value entered,' + sample.Value + ' ' + data[0].units + ', is ' + data[0].type +
                        ' the limit for ' + data[0].name + ' of ' + data[0].limit + ' ' + data[0].units + '.';
                } else {
                    sample.warning = false;
                }
            });
        };

        $scope.closePublishModal = function () {
            $('#publishModal').modal('hide');
        }



        $scope.checkPublishedValueForWarning = function (sample, dt, lastPublishedToCheck) {

            var deferred = $q.defer();
            $scope.getUpperAndLowerLimits(sample.ParameterId, sample.Value, dt).then(function (data) {               

                if (data.length > 0) {
                    $scope.warnings.push(data[0]);
                }
                
                if ($scope.warnings.length > 0) {
                    
                    if (lastPublishedToCheck) {
                        angular.element('#warningsPublishedModal').modal('show');
                    }
                    $scope.$watch('confirmedPublishWarnings', function (newValue, oldValue) {
                        if (newValue == true) {
                            deferred.resolve();
                        }
                    });
                }
                if (lastPublishedToCheck && $scope.warnings.length == 0) {
                    deferred.resolve();
                }
            });
            return deferred.promise;
        };

        $scope.getUpperAndLowerLimits = function (id, value, dt) {
            var deferred = $q.defer();
            
            var data = [];
            $scope.allParameters.forEach(function (v, k) {
                
                if (v.Id == id) {
                    if (typeof (dt) === 'undefined') {
                        dt = '';
                    }
                    if (v.NonfatalUpperRange !== null && typeof (v.NonfatalUpperRange) !== 'undefined') {
                        if (parseFloat(value) > v.NonfatalUpperRange) {
                            data.push(
                                {
                                    name: v.Name,
                                    value: value,
                                    limit: v.NonfatalUpperRange,
                                    type: 'above',
                                    units: v.Units,
                                    dt: dt
                                });
                        }
                       
                    }
                    if (v.NonfatalLowerRange !== null && typeof (v.NonfatalLowerRange) !== 'undefined') {
                        if (parseFloat(value) < v.NonfatalLowerRange) {
                           data.push(
                                {
                                    name: v.Name,
                                    value: value,
                                    limit: v.NonfatalLowerRange,
                                    type: 'below',
                                    units: v.Units,
                                    dt: dt
                                })
                        }
                    }
                    deferred.resolve(data);
                }

            });
            return deferred.promise;
        }

        $scope.confirmWarnings = function () {
            $scope.confirmedWarnings = true;
        }

        $scope.confirmNoSamples = function () {
            $scope.confirmedNoSamples = true;
        }

        $scope.confirmPublishWarnings = function () {
            $scope.confirmedPublishWarnings = true;
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

        $scope.checkSamples = function () {
            var deferred = $q.defer();
            var cnt = 0;
            $scope.warnings = [];
            if ($scope.editSample.length > 0) {
                angular.forEach($scope.editSample, function (value, key) {
                    $scope.getUpperAndLowerLimits(value.ParameterId, value.Value).then(function (data) {

                        cnt = cnt + 1;
                        if (data.length > 0) {
                            $scope.warnings.push(data[0]);
                        }
                        if (cnt == $scope.objectLength($scope.editSample)) {
                            deferred.resolve();
                        }
                    });
                });
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }

        $scope.upload = function (noSamples) {
            $log.log('uploading..');
            
            angular.forEach($scope.editSample, function (value, index) {
                if ((typeof $scope.editSample[index]['Value'] == 'undefined' | $scope.editSample[index]['Value'] == '' | $scope.editSample[index]['Value'] == null) &&
                    (typeof $scope.editSample[index]['ProblemId'] == 'undefined' | $scope.editSample[index]['ProblemId'] == null)) {
                    var hasId = false;
                    if (typeof $scope.editSample[index]['Id'] !== 'undefined') {
                        hasId = true;
                        var id = $scope.editSample[index]['Id']
                    }
                    delete $scope.editSample[index];
                    if (hasId == true) {
                        return (new sampleService()).$remove({ key: id })
                    }
                }
            });

            

            $scope.checkForWarnings().then(function () {
                $log.log('checked');
                var SampleDate = new Date($scope.editEvent.SampleDate)
                SampleDate = SampleDate.getFullYear() + '-' + ("0" + (SampleDate.getMonth() + 1)).slice(-2) + "-" + ("0" + SampleDate.getDate()).slice(-2)

                var SampleTime = $scope.editEvent.SampleTime

                SampleTime = moment(SampleTime, "h:mm a").format('HH:mm:ss');

                var SampleDateTime = SampleDate + 'T' + SampleTime + 'Z';


                notificationFactory.success('Adding New Samples.', 'Adding Samples', { timeOut: 0, extendedTimeOut: 0 });

                var DateTimeNow = new Date().toJSON();

                var addEvent = {
                    "DateTime": SampleDateTime,
                    "StationId": $scope.editEvent.StationId,
                    "GroupId": $scope.editEvent.GroupId,
                    "ModifiedDate": DateTimeNow,
                    "ModifiedBy": userId,
                    "Comments": $scope.editEvent.Comments
                }

                return (new eventService(addEvent)).$patch({ key: $scope.editEvent.EventId })
                .then(function (data) {

                    angular.forEach($scope.editCondition, function (value, key) {
                        if (typeof value.Value != 'undefined' &
                                value.Value != '' & value.Value != null) {
                            var currentCondition = {
                                "EventId": value.EventId,
                                "ConditionId": value.ConditionId,
                                "Value": value.Value
                            }

                            if (typeof (value.EventConditionId) !== 'undefined') {
                                return (new eventConditionService()).$getById({ 'key': value.EventConditionId })
                                .then(function (data) {
                                    return (new eventConditionService(currentCondition)).$patch({ 'key': data.Id });
                                });
                            } else {
                                return (new eventConditionService(currentCondition)).$save();
                            }
                        }
                    });

                    angular.forEach($scope.monitors, function (v, k) {

                        if (v.Id !== null && v.Hours !== null) {
                            var addMonitorEvent = {
                                "EventId": $scope.editEvent.EventId,
                                "UserId": v.Id,
                                "Hours": parseFloat(v.Hours),
                                'CreatedDate': DateTimeNow,
                                'CreatedBy': userId,
                                'ModifiedDate': DateTimeNow,
                                'ModifiedBy': userId
                            }
                            if (typeof (v.MonitorLogId) !== 'undefined') {
                                return (new monitorLogService()).$getById(
                                    {
                                        key: v.MonitorLogId
                                    }
                                ).then(function (data) {
                                    (new monitorLogService(addMonitorEvent)).$patch({ key: data.Id });

                                });
                            } else {
                                (new monitorLogService(addMonitorEvent)).$save();
                            }
                        }

                    });
                    
                    if (!noSamples) {
                        var cnt = 0;
                        angular.forEach($scope.editSample, function (value, key) {
                            delete value.formIndex;
                            if (typeof value.dupExists !== 'undefined') {
                                delete value.dupExists;
                            }
                            if (typeof value.groupParamWarning !== 'undefined') {
                                delete value.groupParamWarning;
                            }
                            if (typeof value.requiresDuplicate !== 'undefined') {
                                delete value.requiresDuplicate;
                            }
                            value['EventId'] = $scope.editEvent.EventId;
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
                            value['ParameterId'] = value['ParameterId'];
                            value['Value'] = parseFloat(value['Value']);
                            value['QaFlagId'] = value['QaFlagId'];
                            value['SampleId'] = value['SampleId'];
                            value['Comments'] = $scope.editEvent.Comments;
                            value['ModifiedDate'] = DateTimeNow;
                            value['ModifiedBy'] = userId;
                            delete value.requiresSampleDepth;
                            delete value.isCalibration;
                            delete value.Matrix;
                            delete value.warning;
                            delete value.warningText;

                            if (typeof value['Id'] !== 'undefined') {
                                return (new sampleService(value)).$patch({ key: value['Id'] })
                                .then(function (data) {
                                    $scope.getSamples($scope.stationId);
                                    cnt = cnt + 1;

                                    if (cnt == $scope.objectLength($scope.editSample)) {

                                        $scope.onSuccessEdit();
                                    }
                                });
                            } else {
                                value['CreatedDate'] = DateTimeNow;
                                value['CreatedBy'] = userId;
                                return (new sampleService(value)).$save()
                                .then(function (data) {
                                    $scope.getSamples($scope.stationId);
                                    cnt = cnt + 1;
                                    if (cnt == $scope.objectLength($scope.editSample)) {
                                        $scope.onSuccessEdit();
                                    }
                                });
                            }

                        });
                    } else {
                        $scope.onSuccessEdit();
                    }
                });
                
            });
        }

        $scope.addSamples = function (form) {
            if (form.$valid) {
                var checkDepths = [];
                //check that for each sample that has a value, there is a corresponding depth value. 
                angular.forEach($scope.editSample, function (value, key) {
                    if (typeof value.formIndex !== 'undefined') {
                        var strInt = value.formIndex;
                        if ($scope.objectLength($scope.depths) > 0) {
                            if (typeof $scope.depths[strInt]['Depth'] !== 'undefined' && $scope.depths[strInt]['Depth'] !== '') {
                                value['Depth'] = $scope.depths[strInt]['Depth'];
                            }
                        }
                    }
                });
                angular.forEach($scope.editSample, function (value, index) {
                    if ((typeof $scope.editSample[index]['Value'] !== 'undefined' && $scope.editSample[index]['Value'] !== '' && $scope.editSample[index]['Value'] !== null) &&
                        (typeof $scope.editSample[index]['Depth'] == 'undefined' | $scope.editSample[index]['Depth'] == '' | $scope.editSample[index]['Depth'] == null) &&
                        $scope.editSample[index]['requiresSampleDepth'] == true) {
                        $log.log('testDepth');
                        $log.log($scope.editSample[index]);
                        checkDepths.push(1);
                    }
                });


                if (checkDepths.length >0) {                    
                    $scope.profileDepthError = true;
                    notificationFactory.error('Please check form. It appears in the Depth Profile Section there is a Sample Value without a corresponding depth.',
                        'Something went wrong');
                } else {
                    var countSamples = 0;
                    angular.forEach($scope.editSample, function (value, index) {
                        if ((typeof $scope.editSample[index]['Value'] == 'undefined' | $scope.editSample[index]['Value'] == '' | $scope.editSample[index]['Value'] == null) &&
                                (typeof $scope.editSample[index]['ProblemId'] == 'undefined' | $scope.editSample[index]['ProblemId'] == null)) {
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

                angular.forEach(form.$error, function (field) {
                    angular.forEach(field, function (errorField) {
                        errorField.$setTouched();
                    })
                });
            }
        }
        $scope.onSuccessEdit = function () {
            $scope.editEventLoadingDone = false;
            $scope.addSampleForm.$setPristine();
            $scope.addSampleForm.$setUntouched();
            $scope.editEventSamples = {};
            $scope.editEvent = {};
            $scope.editCondition = {};
            $scope.gridApi.selection.clearSelectedRows();
            $scope.getSamples($scope.stationId);
            //$scope.populateUserDropdowns($scope.slctGroupId);
            $scope.monitors = [];
            $scope.gridApi.core.refresh();
            $scope.confirmedWarnings = false;
            $scope.confirmedNoSamples = false;
            $scope.profileDepthError = false;
            $scope.showSelectMsg = false;
            $scope.qaFlagsAllId = $scope.qaFlagsAllList[0].value;
            notificationFactory.success('Samples edited successfully', 'Samples Edited!');
            //var url = "https://" + $window.location.host + "/Admin/#/samplesAdmin/editConfirmation";
            //$log.log(url);
            //$window.location.href = url;
        }
        $scope.getPlotParameters = function () {
            $scope.plotParameters = [];
            angular.forEach($scope.samples, function (value, key) {
                
                var len = $filter('filter')($scope.plotParameters, { 'id': value.ParameterId }).length;
           
                if (len < 1) {
                    var paramName = "";
                  
                    var thisParam = $filter('filter')($scope.allParameters, { 'Id': value.ParameterId });
                    if (typeof thisParam !=='undefined') {
                        paramName = thisParam[0].Name 
                    }
                    //$log.log({ 'id': value.ParameterId, 'name': paramName });
                    $scope.plotParameters.push({ 'id': value.ParameterId, 'name': paramName });
                }
                
            });
            
        }
        $scope.getPlotData = function (paramId) {

            $scope.currentPlotParamId = paramId;
            
            $scope.eventDateTimes = [];
            $scope.eventData = [];
            angular.forEach($scope.samples, function (value, key) { 
                  
                if (value.ParameterId == paramId) {
                    $scope.eventDateTimes.push(moment(value.Event.DateTime));
                }
                if (value.ParameterId == paramId) {
                    $scope.eventData.push(value.Value);
                }
            });
            $scope.fillPlot();
        }

        $scope.publishDialogue = function () {
            var row = $scope.gridApi.selection.getSelectedRows();
            $scope.togglePublishBtn = false;
            if (row.length > 0) {
                $scope.nEventsToPublish = row.length;
                $('#publishModal').modal('show');
            }
        }

        $scope.deleteDialogue = function () {
            var row = $scope.gridApi.selection.getSelectedRows();
            if (row.length > 0) {
                $('#deleteModal').modal('show');
                $scope.nEventsToDelete = row.length;
            }
        }

        

        $scope.publishSelected = function (check) {
            if (!check) {
                $log.log(1);
                var processEvent = function (id, dt, lastEventId) {
                    
                    //$log.log($scope.count);
                    
                    return (new sampleService()).$getByEventId({ eventId: id })
                };
                    
                    

                $scope.count = 0;
                var row = $scope.gridApi.selection.getSelectedRows();
                var eventIds = [];
                var batchRequest = [];
                var countBatch = 0;
                var lastEventId = row[row.length - 1].Id;
                var promises = [];
                angular.forEach(row, function (v, k) {
                    promises.push(processEvent(v.Id));
                });



                $q.all(promises).then(function success(data) {
                    console.log('done'); // Should all be here
                    console.log(data);

                    angular.forEach(data, function (value, key) {
                        var sampleSize = value.value.length;
                        
                        if (sampleSize > 0) {
                            angular.forEach(value.value, function (v, k) {
                                batchRequest.push({ requestUri: "Samples(" + v.Id + ")", method: "PATCH", data: { QaFlagId: 2 } });
                            });
                        }
                    });

                    var batchFinal = [];
                    var batchLength = batchRequest.length;
                    var countBatch = 0;
                    var countBatchSub = 0;
                    var batchPromises = [];
                    var postBatch = function (batchFinal) {
                        var d = $q.defer();
                        oData.request({
                            requestUri: "/odata/$batch",
                            method: "POST",
                            data: {
                                __batchRequests: batchFinal
                            }
                        }, function (data, response) {
                            d.resolve(data);
                        }, undefined, window.odatajs.oData.batch.batchHandler);
                        return d.promise;
                    }
                    angular.forEach(batchRequest, function (value, key) {
                        countBatch += 1; countBatchSub += 1;
                        batchFinal.push(value);
                        if (countBatchSub == 90) {
                            batchPromises.push(postBatch(batchFinal));
                            countBatchSub = 0;
                            batchFinal = [];

                        } else if (countBatch == batchLength) {
                            batchPromises.push(postBatch(batchFinal));

                        }
                    });
                    $q.all(batchPromises).then(function () {
                        $scope.samples = [];
                        $scope.getSamples($scope.stationId);
                       
                        //$scope.getPlotParameters();
                        notificationFactory.success('Event(s) published successfully', 'Event(s) Published!');
                        $('#publishModal').modal('hide');
                        $scope.lastPublishedToCheck = false;
                    });
                }, function failure(err) {
                    // Can handle this is we want
                });

            } else {
                var samples = [];
                var cnt = 0;
                var checkEvents = function (id, dt, lastEventId) {                   
                    
                    var defer = $q.defer();
                    (new sampleService()).$getByEventId({ eventId: id })
                    .then(function (data) {
                        var eventSamples = []
                        angular.forEach(data.value, function (value, key) {
                            value.dt = dt;
                            value.eventId = id;
                            eventSamples.push(value);
                        });
                        defer.resolve(eventSamples);
                    })
                    return defer.promise;
                }

                var row = $scope.gridApi.selection.getSelectedRows();                
                var lastEventId = row[row.length - 1].Id;
                var promises = [];
                angular.forEach(row, function (v, k) {
                    promises.push(checkEvents(v.Id, v.DateTime, lastEventId));
                });



                $q.all(promises).then(function success(data) {
                    var size = data.length;
                    $scope.warnings = [];
                    
                    var samples = [];
                    angular.forEach(data, function (value, key) {
                        angular.forEach(value, function (v, k) {
                            samples.push(v);
                        })
                    });
                    $log.log('samples')
                    $log.log(samples);
                    var lastPublishedToCheck = false;
                    var checkAndConfirmWarnings = function () {
                        var deferred = $q.defer();
                        if (samples.length > 0) {
                            angular.forEach(samples, function (value, key) {
                                if (value === samples[samples.length - 1]) {
                                    lastPublishedToCheck = true;
                                }

                                //$log.log(value);
                                $scope.checkPublishedValueForWarning(value, value.dt, lastPublishedToCheck).then(function () {
                                    $scope.confirmedPublishWarnings = false;
                                    if (lastPublishedToCheck) {
                                        deferred.resolve();
                                    }
                                });
                            })
                        } else {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }
                    console.log('check done'); // Should all be here
                    checkAndConfirmWarnings().then(function () {
                        $scope.publishSelected(false);
                    })
                }, function failure(err) {
                    // Can handle this is we want
                });
            }
        };

        

        $scope.deleteSelected = function () {
            var row = $scope.gridApi.selection.getSelectedRows();
            if (row.length > 0) {
                //$scope.nEventsToDelete = row.length;
                var size = row.length-1;
                var batchRequest = [];
                var countBatch = 0;
                angular.forEach(row, function (v, k) {
                    
                   
                    //Note: deleting event deletes all associated samples and conditions
                    batchRequest.push({ requestUri: "Events(" + v.Id + ")", method: "DELETE" });
                    countBatch += 1;
                    if (k == size | countBatch == 90) {
                        
                        oData.request({
                            requestUri: "/odata/$batch",
                            method: "POST",
                            data: {
                                __batchRequests: batchRequest
                            }
                        }, function (data, response) {
                            if (k == size) {
                                $scope.samples = [];
                                $scope.getSamples($scope.stationId);
                                $scope.getPlotParameters();
                                notificationFactory.success('Event(s) deleted successfully', 'Event(s) Deleted!');
                                $('#deleteModal').modal('hide');
                            }
                        }, undefined, window.odatajs.oData.batch.batchHandler);
                        if (countBatch == 90) {
                            countBatch = 0;
                            batchRequest = [];
                        }
                    }
                });
                
            }
        }

        $scope.$watch('editEvent.StationId', function (newValue, oldValue) {
            $scope.checkIfEventExists();
        }, true);//add true here to watch for value equality rather than reference equality. important for watchin object property

        $scope.$watch('editEvent.SampleTime', function (newValue, oldValue) {
            $scope.checkIfEventExists();
        }, true);//add true here to watch for value equality rather than reference equality. important for watchin object property

        $scope.$watch('editEvent.SampleDate', function (newValue, oldValue) {
            $scope.checkIfEventExists();
        }, true);//add true here to watch for value equality rather than reference equality. important for watchin object property

        $scope.checkIfEventExists = function () {

            if ($scope.editEvent.SampleTime !== null && $scope.editEvent.SampleDate !== null && $scope.slctGroupId !== null && $scope.editEvent.StationId !== null &&
            typeof $scope.editEvent.SampleTime !== 'undefined' && typeof $scope.editEvent.SampleDate !== 'undefined' &&
            typeof $scope.slctGroupId !== 'undefined' && typeof $scope.editEvent.StationId !== 'undefined') {

                var SampleDate = new Date($scope.editEvent.SampleDate);
                SampleDate = SampleDate.getFullYear() + '-' + ("0" + (SampleDate.getMonth() + 1)).slice(-2) + "-" + ("0" + SampleDate.getDate()).slice(-2);
                var SampleTime = $scope.editEvent.SampleTime;

                SampleTime = moment(SampleTime, "h:mm a").format('HH:mm:ss');

                var SampleDateTime = SampleDate + 'T' + SampleTime + 'Z';

                return (new eventService()).$getByGroupStationAndDateTime({ dateTime: SampleDateTime, stationId: $scope.editEvent.StationId, groupId: $scope.slctGroupId })
                .then(function (data) {
                    $log.log($scope.editEvent.StationId);
                    $log.log($scope.stationIdInit);
                    $log.log(SampleDateTime);
                    $log.log($scope.sampleDateTimeInit);
                    $log.log($scope.sampleDateInit);
                    if (data.value.length > 0 && !($scope.editEvent.StationId == $scope.stationIdInit && SampleDateTime == $scope.sampleDateTimeInit )) {
                        $scope.addSampleForm.SampleTime.$setValidity('eventExistsError', false)
                        $scope.addSampleForm.SampleDate.$setValidity('eventExistsError', false)
                        $scope.addSampleForm.Station.$setValidity('eventExistsError', false)
                    } else {
                        $scope.addSampleForm.SampleTime.$setValidity('eventExistsError', true)
                        $scope.addSampleForm.SampleDate.$setValidity('eventExistsError', true)
                        $scope.addSampleForm.Station.$setValidity('eventExistsError', true)

                    }
                })
            }
        }


        $scope.fillPlot = function () {
            var A = $scope.eventDateTimes;
            var B = $scope.eventData;

            var all = [];

            for (let i = 0; i < B.length; i++) {
                all.push({ 'A': A[i], 'B': B[i] });
            }

            all.sort(function (a, b) {
                return a.A - b.A;
            });

            A = [];
            B = [];

            for (let j = 0; j < all.length; j++) {
                A.push(all[j].A);
                B.push(all[j].B);
            }         

            $scope.eventDateTimes = A;
            $scope.eventData = B;
            $scope.plotLabels = $scope.eventDateTimes;//[newDate(-6), newDate(-4), newDate(-3), newDate(-2), newDate(-1), newDate(0)];
            $scope.plotSeries = ['Series A']//, 'Series B'];
            $scope.plotData = [];
            $scope.plotData.push($scope.eventData);
              
              //[[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]];
            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };
            
            //$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];//, { yAxisID: 'y-axis-2' }
            $scope.plotOptions = {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        tension: 0
                    }
                },
                scales: {
                    yAxes: [
                      {
                          id: 'y-axis-1',
                          type: 'linear',
                          display: true,
                          position: 'left'
                      }
                    ],
                    xAxes: [{
                        type: 'time',
                        time: {
                            format: "MM-DD-YYYY",
                            unit: 'month',
                            displayFormats: {
                                'minute': 'DD/MM/YYYY HH:mm',
                                'hour': 'MM-DD-YYYY'
                            }
                        },
                        ticks: {
                            minRotation: 45,
                        },
                    }]

                }
            };
        }
        
    };
    samplesEditController.$inject = ['$scope', 'uiGridConstants', '$log', 'notificationFactory',
                                    '$q', '$filter', 'stationGroupService', 'parameterService', 'eventService',
                                    'qaFlagService', 'sampleService', 'problemService', 'qualifierService',
                                    'conditionService', 'eventConditionService', 'conditionCategoriesService',
                                    'userGroupId', 'userRole', 'userId', 'userName', 'userGroup', 'userService',
                                    'groupService','monitorLogService','$window','oData'];
    
    app.controller("samplesEditController", samplesEditController);
}(angular.module("cmcApp")));