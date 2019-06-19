(function (app) {
    var benthicSamplesEditControllerOld = function ($scope, $filter, $log, $q, $anchorScroll, stationGroupService,
                                            benthicParameterService,qaFlagService,
                                            benthicEventService, benthicSampleService,
                                            userGroup,userGroupId, userRole, userId, userName, userGroupId,                                              
                                            eventConditionService, groupService, benthicEventConditionService,
                                            benthicConditionService,benthicConditionCategoriesService, userService,benthicMonitorLogService, 
                                            notificationFactory, stationService, oData, 
                                            leafletMapEvents, leafletData, $timeout) {


        $scope.initialize = function () {
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

            
            $scope.editSample = {};
            $scope.newCondition = {};            
            $scope.monitors = {};
            $scope.grpId = userGroupId;
            $scope.userRole = userRole;
            $scope.userGroup = userGroup;
            $scope.userName = userName;
            $scope.showSelectMsg = false;
            $scope.editEventSamples = {};
            $scope.editEvent = {};
            $scope.depths = {};
            $scope.hideNoStationForGroup = true;
            $scope.hideNoSamplesForStation = true;
            $scope.noParameters = '';
            $scope.showAllarmMetrics = false;
            $scope.showIwlMetrics = false;

            $scope.orderByMethod = function (prm) {
                var order = 0;
                if($scope.benthicMethod == 'allarm'){
                  order = prm['allarmOrder'];
                } else {
                  order = prm['iwlOrder'];
                }
                return order;
            }
            $scope.allarmMetrics = {
                'total': 0,
                'grp1CommonTotal': 0,
                'grp1RareTotal': 0,
                'grp1DominantTotal': 0,
                'grp2CommonTotal': 0,
                'grp2RareTotal': 0,
                'grp2DominantTotal': 0,
                'grp3CommonTotal': 0,
                'grp3RareTotal': 0,
                'grp3DominantTotal': 0,
                'grp1Total': 0,
                'grp2Total': 0,
                'grp3Total': 0,
                'wqs': 0,
                'wqsGrade': '',                
            };
            $scope.iwlMetrics = {
                'metric1Total': 0,
                'metric2Total': 0,
                'metric3Total': 0,
                'metric4Total': 0
            };
            var myEl = angular.element(document.querySelector('.active'));
            myEl.removeClass('active');
            var myEl = angular.element(document.querySelector('#menuData'));
            
            myEl.addClass('active');
            //$scope.slctGroupId = parseInt(userGroupId);
            //$scope.setVariables();
            var promises = [                              
                $scope.getStations(userGroupId),
                $scope.getGroups(),                
                $scope.getParameters(),
                $scope.getConditions(),
                $scope.getQaFlags(),
                              
            ]
            

            $q.all(promises)
            .then(function (values) {
                
                $scope.allParameters = [];
                $scope.netTimeCodes = ['CT.1', 'CT.2', 'CT.3', 'CT.4'];

                $scope.groupsList = [];

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
                if ($scope.stationsList.length > 0) {
                    //$scope.editEvent.StationId = $scope.stationsList[1].value;
                    $scope.stationId = $scope.stationsList[0].value;
                    $scope.noStations = '';
                } else {
                    $scope.noStations = 'There are no stations for this group.';
                }

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

                $scope.qaFlagsList = [];
                $scope.qaFlagsAllList = [{
                    "name": "",
                    "value": null
                }];
                $scope.qaFlagsAllList.push(
                    {
                        name: "Set All Samples to Uploaded",
                        value: 1
                    },
                    {
                        name: "Set All Samples to Verified",
                        value: 2
                    }
                );
                if (userId != "Coordinator" & userId != "Monitor") {
                    $scope.qaFlagsAllList.push({
                        name: "Set All Samples to Published",
                        value: 3
                    });
                }
                $scope.qaFlagsAllId = $scope.qaFlagsAllList[0].value;
                $scope.qaFlags = values[4].value;
                angular.forEach($scope.qaFlags, function (value, key) {
                    $scope.qaFlagsList.push(
                        {
                            value: value.Id,
                            name: value.Description
                        }
                    );
                });

                $scope.conditions = values[3].value;

                $scope.allParameters = values[2].value;

                $scope.setupConditionDropdowns();

                //if ($scope.benthicMethod == 'iwl') {
                    $scope.bottomTypeList = bottomTypes;
                    $scope.bottomType = $scope.bottomTypeList[0].value;
                //}

                   
                $scope.bottomTypeFilter = function (item) {
                    var bType = $scope.bottomType;
                    if (item.BottomType === 0 || item.BottomType === parseInt(bType)) {
                        return item;
                    }
                };

                $scope.conditionMethodFilter = function (item) {
                    var benthicMethod = $scope.benthicMethod;
                    if (typeof benthicMethod !== 'undefined') {
                        //alert(benthicMethod);
                    }
                    if ((item.Method === 'both' || item.Method === benthicMethod) && $scope.netTimeCodes.indexOf(item.Code)==-1 ) {
                        return item;
                    }
                };
                $scope.collectionTimeFilter = function (item) {
                    if ($scope.netTimeCodes.indexOf(item.Code) > -1) {
                        return item;
                    }
                }
            });
        };

        $scope.getParameters = function () {
            return (new benthicParameterService()).$getAll();
        }

        $scope.getQaFlags = function () {
            return (new qaFlagService()).$getAll();
        }

        $scope.$watch('stationId', function (newValue, oldValue) {
            if (newValue != null) {
                $scope.samples = [];
                $scope.getSamples(newValue);
                $scope.getPlotParameters();
            }
        });

        $scope.fillGrid = function () {
            var colCount = 500;
            var rowCount = 500;
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
                        field: 'VerifiedStatus',
                        name: 'Samples to Verify'
                    }
                );
                gridOptions.columnDefs.push(
                    {
                        field: 'PublishedStatus',
                        name: 'Samples to Publish'
                    }
                );
            }

            function generateData() {
                var cnt = 0;
                var plotThisId = 0;
                var uniqueEvents = [];
                var uniqueObj = [];
                for (i = 0; i < $scope.samples.length; i++) {
                    if (uniqueEvents.indexOf($scope.samples[i].BenthicEvent.Id) === -1) {
                        uniqueObj.push($scope.samples[i])
                        uniqueEvents.push($scope.samples[i].BenthicEvent.Id);
                    }

                }

                angular.forEach(uniqueEvents, function (value, key) {
                    var samples = $filter('filter')($scope.samples, {
                        BenthicEvent: {
                            Id: value
                        }
                    });


                    var datetime = samples[0].BenthicEvent.DateTime;
                    var station = samples[0].BenthicEvent.Station.Name;
                    var group = samples[0].BenthicEvent.Group.Name;
                    var id = samples[0].BenthicEvent.Id;
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
                    var verifiedStatus = cnt1;
                    var publishedStatus = cnt2;
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
                        } else if (v.field == 'VerifiedStatus') {
                            row[v.field] = verifiedStatus;
                        } else if (v.field == 'PublishedStatus') {
                            row[v.field] = publishedStatus;
                        }
                    });
                    gridOptions.data.push(row);
                });
                $scope.getPlotData(plotThisId);
                $scope.fillPlot();
            }
            function createGridOptions() {
                gridOptions = {
                    enableFiltering: true,
                    enableSorting: true,
                    fastWatch: true,
                    multiSelect: false,
                    columnDefs: [],
                    data: []
                };
                generateColumns();
                generateData();

                $scope.gridOptions = gridOptions;
                for (var i = 0; i < $scope.gridOptions.columnDefs.length; i++) {
                    $scope.gridOptions.columnDefs[i].width = '200';
                }
            }
            createGridOptions();
            $scope.gridOptions.onRegisterApi = function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    var row = $scope.gridApi.selection.getSelectedRows()
                    if (row.length > 0) {
                        $scope.getSelectedEvent(row);
                        $scope.showSelectMsg = true;
                    } else {
                        $scope.editEvent = {};
                        $scope.showSelectMsg = false;
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
                var id = row[0].Id;
                return (new benthicSampleService()).$getByEventId({
                    eventId: id
                }).then(function (data) {
                    $scope.editEventSamples = data.value;
                    $scope.getEditEvent();

                    $scope.getEventConditionsByEventId(id);
                })
            };
        }



        $scope.getEditEvent = function () {
            $scope.editEvent = {};
            $scope.editEvent.EventId = $scope.editEventSamples[0].BenthicEvent.Id;
            $scope.editEvent.SampleDate = moment($scope.editEventSamples[0].BenthicEvent.DateTime.substring(0, 10));
            $scope.editEvent.SampleTime = $scope.editEventSamples[0].BenthicEvent.DateTime.substring(11, 22);
            $scope.editEvent.GroupId = $scope.editEventSamples[0].BenthicEvent.Group.Id;
            $scope.editEvent.GroupName = $scope.editEventSamples[0].BenthicEvent.Group.Name;
            $scope.editEvent.StationId = $scope.editEventSamples[0].BenthicEvent.Station.Id;
            $scope.editEvent.StationName = $scope.editEventSamples[0].BenthicEvent.Station.Name;
            $scope.editEvent.Comments = $scope.editEventSamples[0].BenthicEvent.Comments;
           
            $scope.populateParameterFormElements($scope.editEvent.GroupId);
            $scope.editEventDateText = $scope.editEvent.SampleDate.format('MM/DD/YY');
            return (new userService()).$getByUserId({ key: $scope.editEventSamples[0].BenthicEvent.CreatedBy })
            .then(function (data) {
                $scope.editEventCreatedBy = data.value[0].FirstName + ' ' + data.value[0].LastName;
                $scope.editEventCreatedByEmail = data.value[0].Email;
            });
        };
        $scope.getEditSample = function () {
            //$scope.editEventSamples = $filter('orderBy')($scope.editEventSamples, []);
           
            angular.forEach($scope.editEventSamples, function (v, k) {
                $log.log('value');
                $log.log(v.BenthicParameter.Code);
                $log.log(v.Value);
                $scope.editSample[v.BenthicParameter.Code]['Value'] = v.Value;
                $scope.editSample[v.BenthicParameter.Code]['ParameterId'] = v.BenthicParameterId;
                $scope.editSample[v.BenthicParameter.Code]['QaFlagId'] = v.QaFlagId;
                $scope.editSample[v.BenthicParameter.Code]['Id'] = v.Id;
            });
            $scope.calculateMetrics();
        };

        $scope.getSelectedEvent = function (row) {
            if (typeof row[0] !== 'undefined') {
                var id = row[0].Id;
                return (new benthicSampleService()).$getByEventId({
                    eventId: id
                }).then(function (data) {
                    $scope.editEventSamples = data.value;

                    $scope.getEditEvent();

                    $scope.getEventConditionsByEventId(id);
                })
            };
        }

        $scope.getEventConditionsByEventId = function (eventId) {
            $scope.editCondition = {};
            angular.forEach($scope.conditions, function (value, key) {
                $scope.editCondition[value.Id] = {};
                $scope.editCondition[value.Id]['Value'] = null;
            });
            return (new benthicEventConditionService()).$getByEventId({ 'key': eventId })
            .then(function (data) {
                angular.forEach(data.value, function (value, key) {
                    $log.log('value');
                    $log.log(value.BenthicConditionId);
                    $log.log(value.Value);
                    $scope.editCondition[value.BenthicConditionId]['Value'] = value.Value;
                    $scope.editCondition[value.BenthicConditionId]['EventConditionId'] = value.Id;
                    $scope.editCondition[value.BenthicConditionId]['ConditionId'] = value.ConditionId;
                    $scope.editCondition[value.BenthicConditionId]['EventId'] = value.EventId;
                });
            });
        }

        $scope.getSamples = function (id) {
            if (userRole == 'Monitor') {
                return (new benthicSampleService()).$getByStationIdAndCreatedByIdAndQAFlagId({
                    stationId: id,
                    userId: userId,
                    qaFlagId: 1
                }).then(function (data) {
                    $scope.samples = data.value;
                    if ($scope.samples.length > 0) {
                        $scope.hideNoSamplesForStation = true;
                        $scope.fillGrid();
                        $scope.getPlotData($scope.currentPlotParamId);
                        $scope.getPlotParameters();
                        if ($scope.plotParameters.length > 0) {
                            $scope.getPlotData($scope.plotParameters[0].id);
                        }
                    } else {
                        $scope.hideNoSamplesForStation = false;
                        $scope.fillGrid();
                    }
                })
            } else if (userRole == 'Coordinator') {
                return (new benthicSampleService()).$getByStationIdAndGroupIdAndQAFlagIdLessThan3({
                    stationId: id,
                    groupId: userGroupId
                }).then(function (data) {
                    $scope.samples = data.value;
                    if ($scope.samples.length > 0) {
                        $scope.hideNoSamplesForStation = true;
                        $scope.fillGrid();
                        $scope.getPlotData($scope.currentPlotParamId);
                        $scope.getPlotParameters();
                        if ($scope.plotParameters.length > 0) {
                            $scope.getPlotData($scope.plotParameters[0].id);
                        }
                    } else {
                        $scope.hideNoSamplesForStation = false;
                        $scope.fillGrid();
                    }
                })
            } else {
                return (new benthicSampleService()).$getByStationId({
                    stationId: id
                }).then(function (data) {
                    $scope.samples = data.value;
                    if ($scope.samples.length > 0) {
                        $scope.hideNoSamplesForStation = true;
                        $scope.fillGrid();
                        $scope.getPlotData($scope.currentPlotParamId);
                        $scope.getPlotParameters();
                        if ($scope.plotParameters.length > 0) {
                            $scope.getPlotData($scope.plotParameters[0].id);
                        }
                    } else {
                        $scope.hideNoSamplesForStation = false;
                        $scope.fillGrid();
                    }
                })

            }
        };

        $scope.getPlotParameters = function () {
            $scope.plotParameters = [];
            angular.forEach($scope.samples, function (value, key) {

                var len = $filter('filter')($scope.plotParameters, { 'id': value.ParameterId }).length;


                if (len < 1) {
                    var paramName = "";

                    var thisParam = $filter('filter')($scope.allParameters, { 'Id': value.ParameterId });
                    if (typeof thisParam !== 'undefined') {
                        paramName = thisParam[0].Name
                    }

                    $scope.plotParameters.push({ 'id': value.ParameterId, 'name': paramName });
                }

            });


        }
        $scope.getPlotData = function (paramId) {

            //$scope.currentPlotParamId = paramId;

            $scope.eventDateTimes = [];
            $scope.eventData = [];
            angular.forEach($scope.samples, function (value, key) {

                if (value.ParameterId == paramId) {
                    $scope.eventDateTimes.push(moment(value.BenthicEvent.DateTime));
                }
                if (value.ParameterId == paramId) {
                    $scope.eventData.push(value.Value);
                }
            });
            $scope.fillPlot();
        }
        $scope.fillPlot = function () {
            var A = $scope.eventDateTimes;
            var B = $scope.eventData;

            var all = [];

            for (var i = 0; i < B.length; i++) {
                all.push({ 'A': A[i], 'B': B[i] });
            }

            all.sort(function (a, b) {
                return a.A - b.A;
            });

            A = [];
            B = [];

            for (var i = 0; i < all.length; i++) {
                A.push(all[i].A);
                B.push(all[i].B);
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

        $scope.populateUserDropdowns = function (grpId) {

            return (new userService()).$getUsersInGroup({ key: grpId }).then(function (v, k) {
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

                angular.forEach([0, 1, 2], function (value, index) {
                    $scope.monitors[value] = {};
                    $scope.monitors[value]['Id'] = $scope.groupUsersList[0].value;
                    $scope.monitors[value]['Hours'] = null;              
                });

            });
        }

        // set maximum date to tomorrow
        $scope.maxDateMoment = moment().add(1, 'day').format('YYYYMMDD');

        $scope.calculateMetrics = function () {
            if ($scope.benthicMethod == 'allarm') {
                $scope.allarmMetrics = {
                    'total': 0,
                    'grp1CommonTotal': 0,
                    'grp1RareTotal': 0,
                    'grp1DominantTotal': 0,
                    'grp2CommonTotal': 0,
                    'grp2RareTotal': 0,
                    'grp2DominantTotal': 0,
                    'grp3CommonTotal': 0,
                    'grp3RareTotal': 0,
                    'grp3DominantTotal': 0,
                    'grp1Total': 0,
                    'grp2Total': 0,
                    'grp3Total': 0,
                    'wqs': 0,
                    'wqsGrade': '',

                };
                
                $scope.allarmMetrics['total'] = 0;
                

                angular.forEach($scope.editSample, function (value, index) {
                    if (!isNaN(parseFloat(value.Value)) && isFinite(value.Value)) {
                        if (value.allarmGroup == 1) {
                            if(value.Value > 0 && value.Value < 10){
                                $scope.allarmMetrics.grp1RareTotal = $scope.allarmMetrics.grp1RareTotal + 1;
                            } else if (value.Value >= 10 && value.Value < 100) {
                                $scope.allarmMetrics.grp1CommonTotal = $scope.allarmMetrics.grp1CommonTotal + 1;
                            } else if (value.Value >= 100) {
                                $scope.allarmMetrics.grp1DominantTotal = $scope.allarmMetrics.grp1DominantTotal + 1;
                            }
                        } else if (value.allarmGroup == 2) {
                            if (value.Value > 0 && value.Value < 10) {
                                $scope.allarmMetrics.grp2RareTotal = $scope.allarmMetrics.grp2RareTotal + 1;
                            } else if (value.Value >= 10 && value.Value < 100) {
                                $scope.allarmMetrics.grp2CommonTotal = $scope.allarmMetrics.grp2CommonTotal + 1;
                            } else if (value.Value >= 100) {
                                $scope.allarmMetrics.grp2DominantTotal = $scope.allarmMetrics.grp2DominantTotal + 1;
                            }
                        } else if (value.allarmGroup == 3) {
                            if (value.Value > 0 && value.Value < 10) {
                                $scope.allarmMetrics.grp3RareTotal = $scope.allarmMetrics.grp3RareTotal + 1;
                            } else if (value.Value >= 10 && value.Value < 100) {
                                $scope.allarmMetrics.grp3CommonTotal = $scope.allarmMetrics.grp3CommonTotal + 1;
                            } else if (value.Value >= 100) {
                                $scope.allarmMetrics.grp3DominantTotal = $scope.allarmMetrics.grp3DominantTotal + 1;
                            }
                        }
                        $scope.allarmMetrics.grp1Total = $scope.allarmMetrics.grp1RareTotal * allarmConstants.grp1Rare +
                            $scope.allarmMetrics.grp1CommonTotal * allarmConstants.grp1Common +
                            $scope.allarmMetrics.grp1DominantTotal * allarmConstants.grp1Dominant;
                        $scope.allarmMetrics.grp2Total = $scope.allarmMetrics.grp2RareTotal * allarmConstants.grp2Rare +
                            $scope.allarmMetrics.grp2CommonTotal * allarmConstants.grp2Common +
                            $scope.allarmMetrics.grp2DominantTotal * allarmConstants.grp2Dominant;
                        $scope.allarmMetrics.grp3Total = $scope.allarmMetrics.grp3RareTotal * allarmConstants.grp3Rare +
                            $scope.allarmMetrics.grp3CommonTotal * allarmConstants.grp3Common +
                            $scope.allarmMetrics.grp3DominantTotal * allarmConstants.grp3Dominant;
                        $scope.allarmMetrics.wqs = $scope.allarmMetrics.grp1Total + $scope.allarmMetrics.grp2Total +
                            $scope.allarmMetrics.grp3Total;
                        if ($scope.allarmMetrics.wqs < allarmConstants.lowerLimit) {
                            $scope.allarmMetrics.wqsGrade = 'Good';
                            $scope.isFair = false;
                            $scope.isPoor = false;
                            $scope.isGood = true;
                        } else if ($scope.allarmMetrics.wqs >= allarmConstants.lowerLimit && $scope.allarmMetrics.wqs <= allarmConstants.upperLimit) {
                            $scope.allarmMetrics.wqsGrade = 'Fair';
                            $scope.isFair = true;
                            $scope.isPoor = false;
                            $scope.isGood = false;
                        } else if ($scope.allarmMetrics.wqs > allarmConstants.upperLimit) {
                            $scope.allarmMetrics.wqsGrade = 'Poor';
                            $scope.isFair = false;
                            $scope.isPoor = true;
                            $scope.isGood = false;
                        }
                    }
                })
                $scope.showIwlMetrics = false;
                $scope.showAllarmMetrics = true;

            } else if ($scope.benthicMethod == 'iwl' & parseInt($scope.bottomType) == 1) {
            
                $scope.iwlMetrics = {
                    'total': 0,
                    'metric1Total': 0,
                    'metric2Total': 0,
                    'metric3Total': 0,
                    'metric4Total': 0,
                    'metric5Total': 0,
                    'metric6Total': 0,
                    'metric1': 0,
                    'metric2': 0,
                    'metric3': 0,
                    'metric4': 0,
                    'metric5': 0,
                    'metric6': 0,
                    'metric1Category': 0,
                    'metric2Category': 0,
                    'metric3Category': 0,
                    'metric4Category': 0,
                    'metric5Category': 0,
                    'metric6Category': 0,
                    'total1': 0,
                    'total2': 0,
                    'mis': 0,
                    'ecologicalCondition': ''
                };
                $scope.iwlMetrics.metric1Total = 0;
                $scope.iwlMetrics.metric2Total = 0;
                angular.forEach($scope.editSample, function (value, index) {                    
                    if (!isNaN(parseFloat(value.Value)) && isFinite(value.Value)) {
                        $scope.iwlMetrics.total = $scope.iwlMetrics.total + parseFloat(value.Value);
                        if (value.iwlRockyGroup == 1) {
                            $scope.iwlMetrics.metric1Total = $scope.iwlMetrics.metric1Total + parseFloat(value.Value);                        
                        } if (value.iwlRockyGroup == 2) {
                            $scope.iwlMetrics.metric2Total = $scope.iwlMetrics.metric2Total + parseFloat(value.Value);
                        } if (value.iwlRockyGroup == 3) {
                            $scope.iwlMetrics.metric3Total = $scope.iwlMetrics.metric3Total + parseFloat(value.Value);
                        } if (value.iwlRockyGroup == 4) {
                            $scope.iwlMetrics.metric4Total = $scope.iwlMetrics.metric4Total + parseFloat(value.Value);
                        } if (value.tolerant == true) {
                            $scope.iwlMetrics.metric5Total = $scope.iwlMetrics.metric5Total + parseFloat(value.Value);
                        } if (value.nonInsects == true) {
                            $scope.iwlMetrics.metric6Total = $scope.iwlMetrics.metric6Total + parseFloat(value.Value);
                        }
                    }
                   
                });
                $scope.iwlMetrics.metric1 = $scope.iwlMetrics.metric1Total / $scope.iwlMetrics.total;
                $scope.iwlMetrics.metric2 = $scope.iwlMetrics.metric2Total / $scope.iwlMetrics.total;
                $scope.iwlMetrics.metric3 = $scope.iwlMetrics.metric3Total / $scope.iwlMetrics.total;
                $scope.iwlMetrics.metric4 = $scope.iwlMetrics.metric4Total / $scope.iwlMetrics.total;
                $scope.iwlMetrics.metric5 = $scope.iwlMetrics.metric5Total / $scope.iwlMetrics.total;
                $scope.iwlMetrics.metric6 = $scope.iwlMetrics.metric6Total / $scope.iwlMetrics.total;

                if ($scope.iwlMetrics.metric1 > iwlRockyConstants.metric1Upper) {
                    $scope.iwlMetrics.metric1Category = 2;
                    $scope.iwlMetrics.total2 = $scope.iwlMetrics.total2 + 1;
                } else if ($scope.iwlMetrics.metric1 >= iwlRockyConstants.metric1Lower && $scope.iwlMetrics.metric1 <= iwlRockyConstants.metric1Upper) {
                    $scope.iwlMetrics.metric1Category = 1;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric1 < iwlRockyConstants.metric1Lower) {
                    $scope.iwlMetrics.metric1Category = 0;
                }

                if ($scope.iwlMetrics.metric2 > iwlRockyConstants.metric2Upper) {
                    $scope.iwlMetrics.metric2Category = 0;
                } else if ($scope.iwlMetrics.metric2 >= iwlRockyConstants.metric2Lower && $scope.iwlMetrics.metric2 <= iwlRockyConstants.metric2Upper) {
                    $scope.iwlMetrics.metric2Category = 1;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric2 < iwlRockyConstants.metric2Lower) {
                    $scope.iwlMetrics.metric2Category = 2;
                    $scope.iwlMetrics.total2 = $scope.iwlMetrics.total2 + 1;
                }

                if ($scope.iwlMetrics.metric3 > iwlRockyConstants.metric3Upper) {
                    $scope.iwlMetrics.metric3Category = 0;

                } else if ($scope.iwlMetrics.metric3 >= iwlRockyConstants.metric3Lower && $scope.iwlMetrics.metric3 <= iwlRockyConstants.metric3Upper) {
                    $scope.iwlMetrics.metric3Category = 1;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric3 < iwlRockyConstants.metric3Lower) {
                    $scope.iwlMetrics.metric3Category = 2;
                    $scope.iwlMetrics.total2 = $scope.iwlMetrics.total2 + 1;
                }

                if ($scope.iwlMetrics.metric4 > iwlRockyConstants.metric4Upper) {
                    $scope.iwlMetrics.metric4Category = 2;
                    $scope.iwlMetrics.total2 = $scope.iwlMetrics.total2 + 1;
                } else if ($scope.iwlMetrics.metric4 >= iwlRockyConstants.metric4Lower && $scope.iwlMetrics.metric4 <= iwlRockyConstants.metric4Upper) {
                    $scope.iwlMetrics.metric4Category = 1;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric4 < iwlRockyConstants.metric4Lower) {
                    $scope.iwlMetrics.metric4Category = 0;
                }

                if ($scope.iwlMetrics.metric5 > iwlRockyConstants.metric5Upper) {
                    $scope.iwlMetrics.metric5Category = 0;

                } else if ($scope.iwlMetrics.metric5 >= iwlRockyConstants.metric5Lower && $scope.iwlMetrics.metric5 <= iwlRockyConstants.metric5Upper) {
                    $scope.iwlMetrics.metric5Category = 1;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric5 < iwlRockyConstants.metric5Lower) {
                    $scope.iwlMetrics.metric5Category = 2;
                    $scope.iwlMetrics.total2 = $scope.iwlMetrics.total2 + 1;
                }

                if ($scope.iwlMetrics.metric6 > iwlRockyConstants.metric6Upper) {
                    $scope.iwlMetrics.metric6Category = 0;
                } else if ($scope.iwlMetrics.metric6 >= iwlRockyConstants.metric6Lower && $scope.iwlMetrics.metric6 <= iwlRockyConstants.metric6Upper) {
                    $scope.iwlMetrics.metric6Category = 1;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric6 < iwlRockyConstants.metric6Lower) {
                    $scope.iwlMetrics.metric6Category = 2;
                    $scope.iwlMetrics.total2 = $scope.iwlMetrics.total2 + 1;
                }
                $scope.iwlMetrics.mis = ($scope.iwlMetrics.total1) + ($scope.iwlMetrics.total2*2);
                if ($scope.iwlMetrics.mis >= iwlRockyConstants.acceptable) {
                    $scope.iwlMetrics.ecologicalCondition = ' is Acceptable.';
                    $scope.isFair = false;
                    $scope.isPoor = false;
                    $scope.isGood = true;
                } else if ($scope.iwlMetrics.mis <= iwlRockyConstants.unacceptable) {
                    $scope.iwlMetrics.ecologicalCondition = 'is Unacceptable.';
                    $scope.isFair = false;
                    $scope.isPoor = true;
                    $scope.isGood = false;
                } else {
                    $scope.iwlMetrics.ecologicalCondition = 'cannot be determined.';
                    $scope.isFair = true;
                    $scope.isPoor = false;
                    $scope.isGood = false;
                }
                $scope.showAllarmMetrics = false;
                $scope.showIwlMetrics = true;
            } else if ($scope.benthicMethod == 'iwl' & parseInt($scope.bottomType) == 2) {////muddy
        

                $scope.iwlMetrics = {
                    'total': 0,
                    'metric1Total': 0,
                    'metric2Total': 0,
                    'metric3Total': 0,
                    'metric4Total': 0,
                    'metric1': 0,
                    'metric2': 0,
                    'metric3': 0,
                    'metric4': 0,
                    'metric1Category': 0,
                    'metric2Category': 0,
                    'metric3Category': 0,
                    'metric4Category': 0,
                    'total1': 0,
                    'total2': 0,
                    'mis': 0,
                    'ecologicalCondition': ''
                };
                $scope.iwlMetrics.metric1Total = 0;
                $scope.iwlMetrics.metric2Total = 0;
                angular.forEach($scope.editSample, function (value, index) {
                    if (!isNaN(parseFloat(value.Value)) && isFinite(value.Value)) {
                        $scope.iwlMetrics.total = $scope.iwlMetrics.total + parseFloat(value.Value);
                        if (value.iwlMuddyGroup == 1) {
                            $scope.iwlMetrics.metric1Total = $scope.iwlMetrics.metric1Total + parseFloat(value.Value);
                        } if (value.iwlMuddyGroup == 2) {
                            $scope.iwlMetrics.metric2Total = $scope.iwlMetrics.metric2Total + parseFloat(value.Value);
                        } if (value.tolerant == true) {
                            $scope.iwlMetrics.metric3Total = $scope.iwlMetrics.metric3Total + parseFloat(value.Value);
                        } if (value.nonInsects == true) {
                            $scope.iwlMetrics.metric4Total = $scope.iwlMetrics.metric4Total + parseFloat(value.Value);
                        }
                    }

                });
                $scope.iwlMetrics.metric1 = $scope.iwlMetrics.metric1Total / $scope.iwlMetrics.total;
                $scope.iwlMetrics.metric2 = $scope.iwlMetrics.metric2Total / $scope.iwlMetrics.total;
                $scope.iwlMetrics.metric3 = $scope.iwlMetrics.metric3Total / $scope.iwlMetrics.total;
                $scope.iwlMetrics.metric4 = $scope.iwlMetrics.metric4Total / $scope.iwlMetrics.total;

                if ($scope.iwlMetrics.metric1 > iwlMuddyConstants.metric1Upper) {
                    $scope.iwlMetrics.metric1Category = 6;
                    $scope.iwlMetrics.total2 = $scope.iwlMetrics.total2 + 1;
                } else if ($scope.iwlMetrics.metric1 >= iwlMuddyConstants.metric1Lower && $scope.iwlMetrics.metric1 <= iwlMuddyConstants.metric1Upper) {
                    $scope.iwlMetrics.metric1Category = 3;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric1 < iwlMuddyConstants.metric1Lower) {
                    $scope.iwlMetrics.metric1Category = 0;
                }

                if ($scope.iwlMetrics.metric2 > iwlMuddyConstants.metric2Upper) {
                    $scope.iwlMetrics.metric2Category = 6;
                    $scope.iwlMetrics.total2 = $scope.iwlMetrics.total2 + 1;
                } else if ($scope.iwlMetrics.metric2 >= iwlMuddyConstants.metric2Lower && $scope.iwlMetrics.metric2 <= iwlMuddyConstants.metric2Upper) {
                    $scope.iwlMetrics.metric2Category = 3;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric2 < iwlMuddyConstants.metric2Lower) {
                    $scope.iwlMetrics.metric2Category = 0;
                    
                }

                if ($scope.iwlMetrics.metric3 > iwlMuddyConstants.metric3Upper) {
                    $scope.iwlMetrics.metric3Category = 0;
                } else if ($scope.iwlMetrics.metric3 >= iwlMuddyConstants.metric3Lower && $scope.iwlMetrics.metric3 <= iwlMuddyConstants.metric3Upper) {
                    $scope.iwlMetrics.metric3Category = 3;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric3 < iwlMuddyConstants.metric3Lower) {
                    $scope.iwlMetrics.metric3Category = 6;
                    $scope.iwlMetrics.total2 = $scope.iwlMetrics.total2 + 1;
                }

                if ($scope.iwlMetrics.metric4 > iwlMuddyConstants.metric4Upper) {
                    $scope.iwlMetrics.metric4Category = 0;
                    
                } else if ($scope.iwlMetrics.metric4 >= iwlMuddyConstants.metric4Lower && $scope.iwlMetrics.metric4 <= iwlMuddyConstants.metric4Upper) {
                    $scope.iwlMetrics.metric4Category = 3;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric4 < iwlMuddyConstants.metric4Lower) {
                    $scope.iwlMetrics.total2 = $scope.iwlMetrics.total2 + 1;
                    $scope.iwlMetrics.metric4Category = 6;
                }

                
                $scope.iwlMetrics.mis = ($scope.iwlMetrics.total1 * 3) + ($scope.iwlMetrics.total2 * 6);
                if ($scope.iwlMetrics.mis >= iwlMuddyConstants.acceptable) {
                    $scope.iwlMetrics.ecologicalCondition = ' is Acceptable.';
                    $scope.isFair = false;
                    $scope.isPoor = false;
                    $scope.isGood = true;
                } else if ($scope.iwlMetrics.mis <= iwlMuddyConstants.unacceptable) {
                    $scope.iwlMetrics.ecologicalCondition = 'is Unacceptable.';
                    $scope.isFair = false;
                    $scope.isPoor = true;
                    $scope.isGood = false;
                } else {
                    $scope.iwlMetrics.ecologicalCondition = 'cannot be determined.';
                    $scope.isFair = true;
                    $scope.isPoor = false;
                    $scope.isGood = false;
                }
                $scope.showAllarmMetrics = false;
                $scope.showIwlMetrics = true;
            }
        }

        $scope.setupConditionDropdowns = function () {
            angular.forEach($scope.conditions, function (value, key) {
                value.Value = null;
                if (value.isCategorical == true) {
                    $scope[value.Code] = [];
                    return (new benthicConditionCategoriesService()).$getByCategoryId({ key: value.Id }).then(function (data) {
                       

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
                $scope.stationsList = [{
                    "name": "",
                    "value": null
                }];
                if (data.value.length > 0) {                    
                    angular.forEach(data.value, function (value, key) {
                        $scope.stationsList.push(
                            {
                                value: value.Station.Id,
                                name: value.Station.Name
                            }
                        );
                    });
                    $scope.editEvent.StationId = $scope.stationsList[1].value;
                    $scope.noStations = '';
                } else {
                    $scope.noStations = 'There are no stations for this group.';
                }
            });

        }

        $scope.populateParameterFormElements = function (grpId) {
            $scope.editSample = {};
            return (new groupService()).$getById({ key: grpId })
            .then(function (data) {
                $scope.parameters = [];
                if (data.BenthicMethod !== null) {
                    $scope.benthicParametersError = false;
                    $scope.benthicMethod = data.BenthicMethod;
                    return (new benthicParameterService()).$getByBenthicMethod({ benthicMethod: data.BenthicMethod })
                    .then(function (data) {
                        angular.forEach(data.value, function (value, key) {
                            $scope.parameters.push(value);
                        });
                        if ($scope.parameters.length > 0) {
                            angular.forEach($scope.parameters, function (value, key) {
                                $scope.editSample[value.Code] = {};
                                $scope.editSample[value.Code]['Value'] = null;
                                $scope.editSample[value.Code]['ParameterBenthicId'] = value.Id;
                                $scope.editSample[value.Code]['allarmGroup'] = value.allarmGroup;
                                $scope.editSample[value.Code]['iwlRockyGroup'] = value.iwlRockyGroup;
                                $scope.editSample[value.Code]['iwlMuddyGroup'] = value.iwlMuddyGroup;
                                $scope.editSample[value.Code]['tolerant'] = value.tolerant;
                                $scope.editSample[value.Code]['nonInsects'] = value.nonInsects;
                                
                            });
                            $scope.noParameters = '';
                            $scope.getEditSample();
                            
                        } else {
                            $scope.noParameters = 'There are no parameters for this group.';
                        }
                        
                    });
                } else {
                    $scope.benthicParametersError = true;
                }
                
            });

        }

        $scope.getStations = function (grpId) {
            var stations = [];
            var strGrpId = grpId.toString();
            return (new stationGroupService()).$getStationsByGroupId({ key: grpId });
        }
       
       
        $scope.getGroup = function () {
            return (new groupService()).$getById({ key: userGroupId })
        }
        $scope.getGroups = function () {
            return (new groupService()).$getAll();
        }
       

        $scope.getConditions = function () {
            return (new benthicConditionService()).$getAll();
        }
        $scope.addSamples = function (form) {
            //var addEvent = $scope.editEvent;
            if (form.$valid) {
                angular.forEach($scope.editSample, function (value, index) {                    
                    if (
                        (typeof $scope.editSample[index]['Value'] == 'undefined' | $scope.editSample[index]['Value'] == ''|$scope.editSample[index]['Value']==null) ){
                        delete $scope.editSample[index];
                    }
                });

                var keys = Object.keys($scope.editSample);
                var len = keys.length;
                if (len > 0) {
                    var SampleDate = new Date($scope.editEvent.SampleDate)
                    SampleDate = SampleDate.getFullYear() + '-' + ("0" + (SampleDate.getMonth() + 1)).slice(-2) + "-" + ("0" + SampleDate.getDate()).slice(-2)


                    //function hms(duration) {
                    //    var milliseconds = parseInt((duration % 1000) / 100)
                    //        , seconds = parseInt((duration / 1000) % 60)
                    //        , minutes = parseInt((duration / (1000 * 60)) % 60)
                    //        , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

                    //    hours = (hours < 10) ? "0" + hours : hours;
                    //    minutes = (minutes < 10) ? "0" + minutes : minutes;
                    //    seconds = (seconds < 10) ? "0" + seconds : seconds;

                    //    return hours + ":" + minutes + ":" + seconds;
                    //}
                    //tzOff = new Date().getTimezoneOffset() * 60000;

                    //var SampleTime2 = hms($scope.editEvent.SampleTime - tzOff + (3600000 * 5));
                    var SampleTime = $scope.editEvent.SampleTime
                    function addZero(i) {
                        if (i < 10) {
                            i = "0" + i;
                        }
                        return i;
                    }
                    SampleTime = moment(SampleTime, "h:mm a").format('HH:mm:ss');

                    //SampleTime = addZero(SampleTime.getHours()) + ":" + addZero(SampleTime.getMinutes()) + ":" + addZero(SampleTime.getSeconds());
                   

                    //SampleTime = new Date(SampleTime + SampleTime.getTimezoneOffset() * 60 * 1000);
                    //SampleTime = SampleTime.getUTCHours() + ':' + SampleTime.getUTCMinutes() + ':' + SampleTime.getUTCSeconds();

                    var SampleDateTime = SampleDate + 'T' + SampleTime + 'Z';
                    

                    notificationFactory.success('Adding New Samples.', 'Adding Samples', { timeOut: 0, extendedTimeOut: 0 });

                    var DateTimeNow = new Date().toJSON();
                    var addEvent = {
                        "DateTime": SampleDateTime,
                        "StationId": $scope.editEvent.StationId,
                        "GroupId": $scope.slctGroupId,
                        "CreatedDate": DateTimeNow,
                        "CreatedBy": userId,
                        "ModifiedDate": DateTimeNow,
                        "ModifiedBy": userId,
                        "Comments": $scope.editEvent.Comments
                    }
                    //$scope.editEvent = {};
                    //$scope.editSample = {};
                    

                    return (new benthicEventService(addEvent)).$save()
                    .then(function (data) {
                        //$scope.editEvent = {};
                        var eventId = data.Id;
                        angular.forEach($scope.conditions, function (value, key) {
                            if (typeof value.Value != 'undefined' & value.Value != '' & value.Value != null) {
                                var addCondition = {
                                    "BenthicEventId": eventId,
                                    "BenthicConditionId": value.Id,
                                    "Value": value.Value
                                }
                                return (new benthicEventConditionService(addCondition)).$save();
                            }
                        });
                       
                        
                        angular.forEach($scope.monitors, function (value, key) {
                            if (value.Id != null) {
                                var addMonitorEvent = {
                                    "BenthicEventId": eventId,
                                    "UserId": value.Id,
                                    "Hours": parseFloat(value.Hours),
                                    'CreatedDate': DateTimeNow,
                                    'CreatedBy': userId,
                                    'ModifiedDate': DateTimeNow,
                                    'ModifiedBy': userId
                                }
                                return (new benthicMonitorLogService(addMonitorEvent)).$save();
                            }
                        });
                        
                        angular.forEach($scope.editSample, function (value, key) {
                            var addSample = {
                                "BenthicEventId": eventId,
                                "BenthicParameterId": value['ParameterBenthicId'],
                                "Value": parseFloat(value['Value']),
                                "QaFlagId": 1,
                                "Comments": $scope.editEvent.Comments,
                                'CreatedDate' : DateTimeNow,
                                'CreatedBy' : userId,
                                'ModifiedDate' : DateTimeNow,
                                'ModifiedBy' : userId,
                            }
                            return (new benthicSampleService(addSample)).$save()
                            .then(function (data) {                               
                                $scope.editSampleForm.$setPristine();
                                $scope.editSampleForm.$setUntouched();
                                //$scope.parameters = [];
                                $scope.setVariables();
                                $scope.editEvent.StationId = $scope.stationsList[1].value;                                
                                //$scope.populateParameterFormElements($scope.slctGroupId);
                                $scope.setupConditionDropdowns();
                                $scope.populateUserDropdowns($scope.grpId);
                                notificationFactory.success('Samples added successfully', 'Samples Added!');
                                $anchorScroll();
                            });
                        });
                    });

                } else {
                    notificationFactory.error('Please check form. It appears that there are no new samples to add.', 'Something went wrong');
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
        $scope.$watch('slctGroupId', function (newValue, oldValue) {           
            if (newValue != null) {
                if (newValue != null) {
                    //$scope.populateStationsDropdown(newValue);
                }                
            }            
        });

        $scope.isEmptyObject = function (obj) {
            return angular.equals(obj, {});
        };


    };
    benthicSamplesEditControllerOld.$inject = ['$scope', '$filter', '$log', '$q', '$anchorScroll', 'stationGroupService',
                                            'benthicParameterService', 'qaFlagService',
                                            'benthicEventService', 'benthicSampleService',
                                            'userGroup', 'userGroupId', 'userRole', 'userId', 'userName', 'userGroupId',
                                            'eventConditionService', 'groupService', 'benthicEventConditionService',
                                            'benthicConditionService', 'benthicConditionCategoriesService', 'userService', 'benthicMonitorLogService',
                                            'notificationFactory', 'stationService', 'oData',
                                            'leafletMapEvents', 'leafletData', '$timeout'];
    app.controller("benthicSamplesEditControllerOld", benthicSamplesEditControllerOld);
}(angular.module("cmcApp")));