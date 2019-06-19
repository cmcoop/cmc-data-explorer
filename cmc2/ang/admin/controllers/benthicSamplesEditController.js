(function (app) {
    var benthicSamplesEditController = function ($scope, uiGridConstants, $log, notificationFactory,
                                    $q, $filter, $timeout, stationGroupService, benthicParameterService, benthicEventService,
                                    qaFlagService, benthicSampleService, benthicMonitorLogService,
                                    benthicConditionService, benthicEventConditionService, benthicConditionCategoriesService,
                                    userGroupId, userRole, userId, userName, userGroup, oData,
                                    groupService) {

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

            $scope.showNoSamplesMsg = false;
            $scope.showEditEventBtn = false;
            $scope.showGrid = false;
            $scope.showEventGrid = false;
            $scope.initializing = true;
            $scope.gettingFilteredEvents = false;
            $scope.gettingFilteredSamples = false;
            $scope.hideNoStationForGroup = true;
            $scope.maxDateMoment = moment().add(1, 'day').format('YYYYMMDD');
            $scope.minDateMoment = moment("01/01/1900", "MM/DD/YYYY").format('YYYYMMDD');


            $scope.userGroup = userGroup;
            $scope.userName = userName;
            $scope.togglePlot = true;
            $scope.showSelectMsg = false;
            $scope.editEventSamples = {};
            $scope.editEvent = {};
            $scope.conditions = {};
            $scope.depths = {};
            $scope.hideNoStationForGroup = true;
            $scope.hideNoEventsForStation = true;
            var promises = [
               // $scope.getStations(userGroupId),
                $scope.getGroups(),
                $scope.getParameters(),
                $scope.getGroup(),
                $scope.getQaFlags(),
                $scope.getConditions(),
                $scope.getConditionCategories()
            ]

            $q.all(promises)
            .then(function (values) {
                $scope.allParameters = [];

                //$scope.stations = values[0].value;
                //$scope.stationsList = [];
                $scope.groupsList = [];
                $scope.groups = values[0].value;
                angular.forEach($scope.groups, function (value, key) {
                    $scope.groupsList.push(
                        {
                            value: value.Id,
                            name: value.Name
                        }
                    );
                });

                $scope.slctGroupId = parseInt(userGroupId);
                $scope.userGroupInfo = values[2];
                $scope.coordinatorHasEnhancedPriveledges == false;
                if (userRole == 'Coordinator') {
                    $scope.coordinatorHasEnhancedPriveledges = $scope.userGroupInfo.coordinatorCanPublish;
                }

                $scope.qaFlagsList = [];
                

                $scope.qaFlags = values[3].value;
                angular.forEach($scope.qaFlags, function (value, key) {
                    $scope.qaFlagsList.push(
                        {
                            value: value.Id,
                            label: value.Description
                        }
                    );
                });
                $scope.conditions = values[4].value;
                $scope.conditionsList = [];
                angular.forEach($scope.conditions, function (value, key) {
                    $scope.conditionsList.push(
                        {
                            value: value.Id,
                            label: value.Name
                        }
                    );
                });

                $scope.allParameters = values[1].value;
                $scope.parametersList = [];
                angular.forEach($scope.allParameters, function (value, key) {
                    $scope.parametersList.push(
                        {
                            value: value.Name,
                            label: value.Name
                        }
                    );
                });

                $scope.conditionCategories = values[5].value;
                

                
                $scope.initializing = false;
            });
        };

        $scope.getStations = function (grpId) {
            return (new stationGroupService()).$getStationsByGroupId({ key: grpId });
        }
        $scope.getParameters = function () {
            return (new benthicParameterService()).$getAll();
        }

        $scope.getGroup = function () {
            return (new groupService()).$getById({ key: userGroupId });
        }
        $scope.getGroups = function () {
            return (new groupService()).$getAll();
        }

        $scope.getQaFlags = function () {
            return (new qaFlagService()).$getAll();
        }
        $scope.getConditions = function () {
            return (new benthicConditionService()).$getAll();
        }
        $scope.getConditionCategories = function () {
            return (new benthicConditionCategoriesService()).$getAll();
        }

        $scope.getSamples = function (grpId) {
            return (new benthicSampleService()).$getByGroup({
                groupId: grpId
            }).then(function (data) {
                $scope.samples = data.value;
                $scope.fillGrid();
            })
        };

        $scope.getMonitorLogsByEventId = function (eventId) {
            $log.log('thisfired');
            $log.log(eventId);
            $scope.monitors = [];
            return (new benthicMonitorLogService()).$getByEventId({ 'key': eventId })
            .then(function (data) {
                if (data.value.length > 0) {
                    angular.forEach(data.value, function (v, k) {
                        var monitor = {
                            Id: v.UserId,
                            Name: v.ApplicationUser.FirstName + ' ' + v.ApplicationUser.LastName,
                            Hours: v.Hours,
                            MonitorLogId: v.Id
                        };
                        $scope.monitors.push(monitor);
                    });
                    if ($scope.monitors.length > 0) {
                        $scope.fillMonitorGrid();
                    }
                } else {
                    $scope.noMonitorData = true;
                }
            });
        }


        $scope.getFilteredEvents = function () {
            $scope.gettingFilteredEvents = true;
            var data;
            if ($scope.startDate !== null) {
                var startDate = new Date($scope.startDate);
                startDate = startDate.getFullYear() + '-' + ("0" + (startDate.getMonth() + 1)).slice(-2) + "-" + ("0" + startDate.getDate()).slice(-2);
                startDate = startDate + 'T00:00:00Z';
            } else {
                var startDate = '1900-01-01T00:00:00Z'
            }

            if ($scope.endDate !== null) {
                var endDate = new Date($scope.endDate);
                endDate = endDate.getFullYear() + '-' + ("0" + (endDate.getMonth() + 1)).slice(-2) + "-" + ("0" + endDate.getDate()).slice(-2);
                endDate = endDate + 'T00:00:00Z';

            } else {
                var endDate = new Date($scope.maxDateMoment);
                endDate = endDate.getFullYear() + '-' + ("0" + (endDate.getMonth() + 1)).slice(-2) + "-" + ("0" + endDate.getDate()).slice(-2);
                endDate = endDate + 'T00:00:00Z';
            }
            if (!$scope.isMonitor) {
                if ($scope.stationId !== null) {
                    data = (new benthicEventService()).$getByStationIdGroupIdStartDateEndDate({
                        groupId: $scope.slctGroupId,
                        stationId: $scope.stationId,
                        startDate: startDate,
                        endDate: endDate
                    }).then(function (data) {
                        populateEvents(data);
                    })
                } else {
                    data = (new benthicEventService()).$getByGroupIdStartDateEndDate({
                        groupId: $scope.slctGroupId,
                        startDate: startDate,
                        endDate: endDate
                    }).then(function (data) {
                        $log.log('data');
                        $log.log(data);
                        populateEvents(data);
                    })
                }
            } else {
                var strUserId = "'" + userId + "'";
                return (new benthicEventService()).$getByGroupIdStartDateEndDateUser({
                    groupId: $scope.slctGroupId,
                    startDate: startDate,
                    endDate: endDate,
                    userId: strUserId
                }).then(function (data) {
                  
                  populateEvents(data);
                })
                
            }

            function populateEvents(data) {
                $scope.events = data.value;
                if ($scope.events.length > 0) {
                    $scope.hideNoEventsForStation = true;
                    $scope.fillEventGrid();

                } else {
                    $scope.hideNoEventsForStation = false;
                    $scope.fillEventGrid();

                }
            }
        };



        $scope.getEventConditionsByEventId = function (eventId) {
            $scope.editCondition = {};
            angular.forEach($scope.conditions, function (value, key) {
                $scope.editCondition[value.Id] = {};
                $scope.editCondition[value.Id]['Value'] = null;
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

        $scope.isEmptyObject = function (obj) {
            return angular.equals(obj, {});
        };

        $scope.publishDialogue = function (publishStatus) {
            var row = $scope.eventGridApi.selection.getSelectedRows();
            if (row.length > 0) {
                $scope.nEventsToPublish = row.length;
                $scope.publishStatus = publishStatus;
                $('#publishModal').modal('show');
            }
        }

        $scope.deleteDialogue = function () {
            var row = $scope.eventGridApi.selection.getSelectedRows();
            if (row.length > 0) {
                $scope.nEventsToDelete = row.length;
                $('#deleteModal').modal('show');
            }
        }

        $scope.publishSelected = function () {
            
            var processEvent = function (id) {
                return (new benthicSampleService()).$getByEventId({ eventId: id })
            }

            var row = $scope.eventGridApi.selection.getSelectedRows();
            var qaFlagId = 2;
            if (!$scope.publishStatus) {
                qaFlagId = 1;
            }
            
            var batchRequest = [];
            var countBatch = 0;

            var lastEventId = row[row.length - 1].EventSetId;
            var promises = [];
            angular.forEach(row, function (v, k) {
                promises.push(processEvent(v.EventSetId));
                $log.log('outside');
                $log.log(v.EventSetId + ' ' + lastEventId);
            });

            $q.all(promises).then(function success(data) {
                console.log('done'); // Should all be here
                $log.log(data)
                //$log.log(batchRequest);
                var batchRequest = [];
                angular.forEach(data, function (value, key) {
                    var sampleSize = value.value.length;
                    $log.log(sampleSize);
                    if (sampleSize > 0) {
                        angular.forEach(value.value, function (v, k) {
                            batchRequest.push({ requestUri: "BenthicSamples(" + v.Id + ")", method: "PATCH", data: { QaFlagId: qaFlagId } });
                        });
                    }
                });

                $log.log(batchRequest);
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
                    if (countBatchSub == 90 ) {
                        batchPromises.push(postBatch(batchFinal));
                            $log.log(data);
                            countBatchSub = 0;
                            batchFinal = [];
                            
                    } else if (countBatch == batchLength) {
                        batchPromises.push(postBatch(batchFinal));
                            
                    }
                });
                $q.all(batchPromises).then(function () {
                    if (!$scope.publishStatus) {
                        notificationFactory.success('Event(s) un-published successfully', 'Event(s) Un-Published!');
                    } else {
                        notificationFactory.success('Event(s) published successfully', 'Event(s) Published!');
                    }
                    $scope.togglePublishBtn = !$scope.togglePublishBtn;
                    $('#publishModal').modal('hide');
                    if (row.length == 1) {
                        if ($scope.showGrid == true) {
                            $scope.getSelectedEvent(row);
                        }
                    }
                });
                
                
               

               
            }, function failure(err) {
                // Can handle this is we want
            });
        };

        $scope.deleteSelected = function () {
            var row = $scope.eventGridApi.selection.getSelectedRows();
            if (row.length > 0) {


                var size = row.length - 1;
                var batchRequest = [];
                var countBatch = 0;
                angular.forEach(row, function (v, k) {

                    //Note: deleting event deletes all associated samples and conditions   
                    batchRequest.push({ requestUri: "BenthicEvents(" + v.EventSetId + ")", method: "DELETE" });
                    countBatch += 1;
                    if (k == (size) | countBatch == 90) {
                        oData.request({
                            requestUri: "/odata/$batch",
                            method: "POST",
                            data: {
                                __batchRequests: batchRequest
                            }
                        }, function (data, response) {
                            if (k == size){
                                $scope.samples = [];
                                $scope.getFilteredEvents();
                                $scope.showGrid = false;
                                //$scope.getPlotParameters();
                                notificationFactory.success('Event(s) deleted successfully', 'Event(s) Deleted!');
                                $scope.toggleDeleteBtn = !$scope.toggleDeleteBtn;
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

        $scope.publishSamplesDialogue = function (publishSamplesStatus) {
            
            var row = $scope.gridApi.selection.getSelectedRows();
            if (row.length > 0) {
                $scope.nSamplesToPublish = row.length;
                $scope.publishSamplesStatus = publishSamplesStatus;
                $('#publishSamplesModal').modal('show');
            }
        }

        $scope.deleteSamplesDialogue = function () {
            var row = $scope.gridApi.selection.getSelectedRows();
            if (row.length > 0) {
                $scope.nSamplesToDelete = row.length;
                $('#deleteSamplesModal').modal('show');
            }
        }

        $scope.publishSelectedSamples = function () {
            var row = $scope.gridApi.selection.getSelectedRows();
            var size = row.length - 1;
            $log.log('size');
            $log.log(size);
            var batchRequest = [];
            var countBatch = 0;
            var qaFlagId = 2;
            if (!$scope.publishSamplesStatus) {
                qaFlagId = 1;
            }
            angular.forEach(row, function (v, k) {
                batchRequest.push({ requestUri: "BenthicSamples(" + v.SampleSetId + ")", method: "PATCH", data: { QaFlagId: qaFlagId } });
                countBatch += 1;
                $log.log('k');
                $log.log(k);
                if (k == (size) | countBatch == 90) {
                    oData.request({
                        requestUri: "/odata/$batch",
                        method: "POST",
                        data: {
                            __batchRequests: batchRequest
                        }
                    }, function (data, response) {
                        //$scope.getFilteredSamples();
                        //$scope.getPlotParameters();
                        if (k == size) {
                            notificationFactory.success('Sample(s) published successfully', 'Sample(s) Published!');
                            $('#publishSamplesModal').modal('hide');
                            var row = $scope.eventGridApi.selection.getSelectedRows();
                            $scope.getSelectedEvent(row);
                            $scope.togglePublishSamplesBtn = !$scope.togglePublishSamplesBtn;
                        }
                    }, undefined, window.odatajs.oData.batch.batchHandler);
                    if (countBatch == 90) {
                        countBatch = 0;
                        batchRequest = [];
                    }
                }
                
            });
        };

        $scope.deleteSelectedSamples = function () {
            var row = $scope.gridApi.selection.getSelectedRows();
            if (row.length > 0) {
                var size = row.length - 1;
                var batchRequest = [];
                var countBatch = 0;
                angular.forEach(row, function (v, k) {

                    //Note: deleting event deletes all associated samples and conditions   
                    batchRequest.push({ requestUri: "BenthicSamples(" + v.SampleSetId + ")", method: "DELETE" });
                    countBatch += 1;
                    if (k == (size) | countBatch == 90) {
                        oData.request({
                            requestUri: "/odata/$batch",
                            method: "POST",
                            data: {
                                __batchRequests: batchRequest
                            }
                        }, function (data, response) {
                            if (k == size) {
                                $scope.samples = [];
                                $scope.getSelectedEvent(row);
                                //$scope.getPlotParameters();
                                notificationFactory.success('Sample(s) deleted successfully', 'Sample(s) Deleted!');
                                $scope.toggleDeleteSamplesBtn = !$scope.toggleDeleteSamplesBtn;
                                $('#deleteSamplesModal').modal('hide');
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

        $scope.$watch('slctGroupId', function (newValue, oldValue) {
            $scope.showEventGrid = false;
            $scope.showGrid = false;
            if (newValue !== null) {
                $scope.populateStationsDropdown(newValue);
                //$scope.getSamples(newValue);
            }
        });

        $scope.$watch('stationId', function (newValue, oldValue) {
            $scope.showGrid = false;
            $scope.showEventGrid = false;
            if (newValue !== null && typeof newValue !== 'undefined') {
                return (new benthicEventService()).$getByStationId({ stationId: newValue })
                .then(function (data) {
                    $scope.getMinMaxDateOfEvents(data);
                })
            } else {
                if ($scope.slctGroupId !== null && typeof $scope.slctGroupId !== 'undefined') {
                    return (new benthicEventService()).$getByGroupId({ groupId: $scope.slctGroupId })
                    .then(function (data) {
                        $scope.getMinMaxDateOfEvents(data);
                    });
                }
            }
        });

        $scope.getMinMaxDateOfEvents = function (data) {
            $scope.maxDateMoment = moment().add(1, 'day').format('YYYYMMDD');
            $scope.minDateMoment = moment("01/01/1900", "MM/DD/YYYY").format('YYYYMMDD');

            if (data.value.length > 0) {
                var lastIndex = data.value.length - 1;
                var minDate = data.value[0].DateTime;
                var maxDate = data.value[lastIndex].DateTime;
                $scope.startDate = moment(minDate).subtract(1, 'day');
                $scope.endDate = moment(maxDate).add(1, 'day');
                $scope.minDateMoment = moment(minDate).subtract(2, 'day').format('YYYYMMDD');
                $scope.maxDateMoment = moment(maxDate).add(2, 'day').format('YYYYMMDD');
                if ($scope.isMonitor) {
                    $scope.getFilteredEvents();
                }
            } else {
                $scope.showEventsWarning = true;
                $scope.startDate = null;
                $scope.endDate = null;
            }



        }


        $scope.populateStationsDropdown = function (grpId) {
            //$scope.startDate = null;
            //$scope.endDate = null;
            $scope.stationsList = [];
            $scope.stationId = 0;
            if (typeof grpId !== 'undefined') {
                return (new stationGroupService()).$getStationsByGroupId({ key: grpId })
                .then(function (data) {
                    if (data.value.length > 0) {
                        $scope.hideNoStationForGroup = true;
                        $scope.stationsList = [{
                            value: null,
                            name: 'All Stations'

                        }];
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
                    }
                });
            }

        }
        $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        }



        $scope.deleteSample = function (sampleId) {
            return (new sampleService()).$remove({ key: sampleId })
            .then(function (data) {
                notificationFactory.success('Samples deleted successfully', 'Samples Deleted!');
                $('#deleteModal').modal('hide');
            });
        }

        $scope.fillGrid = function () {
            var gridOptions = {};
            $scope.eventStationsList = [];
            $scope.eventStationIds = [];

            var valueCellEditable = function ($scope) {
                $log.log('test')
                if ($scope.row.entity.qaFlagId === 2 && ($scope.isMonitor || ($scope.isCoordinator && !$scope.coordinatorHasEnhancedPriveledges))) {
                    $log.log('test1');
                    return false;
                } else {
                    $log.log('test2');
                    return true;
                }
            }

            function generateColumns() {


                
                gridOptions.columnDefs.push(
                    {
                        field: 'ParameterName',
                        name: 'Parameter Name',

                        filter: {
                            type: uiGridConstants.filter.SELECT,
                            selectOptions: $scope.parametersList
                        },
                        enableCellEdit: false,
                       
                        cellFilter: 'griddropdown:this',
                        sortCellFiltered: true,
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return row.entity.edited ? 'gridCellEdited' : '';
                        }
                        

                    }
                );
                var valCol = {
                    field: 'Value',
                    name: 'Value',
                    headerCellClass: $scope.highlightFilteredHeader,                   
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return row.entity.edited ? 'gridCellEdited' : '';
                    },
                    enableCellEdit: true,
                    cellEditableCondition: valueCellEditable
                }
                //if ($scope.isMonitor || ($scope.isCoordinator && !$scope.coordinatorHasEnhancedPriveledges)) {
                //    valCol['enableCellEdit'] = false;
                //}
                
                gridOptions.columnDefs.push(valCol);
                
                var qaFlagCol = {
                    field: 'QaFlagId',
                    name: 'QaFlag',
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: $scope.qaFlagsList
                    },
                    editableCellTemplate: 'ui-grid/dropdownEditor',

                    cellFilter: 'griddropdown:this',
                    sortCellFiltered: true,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        return row.entity.edited ? 'gridCellEdited' : '';
                    },
                    editDropdownValueLabel: 'label',
                    editDropdownIdLabel: 'value',
                    editDropdownOptionsArray: $scope.qaFlagsList

                };
                if ($scope.isMonitor || ($scope.isCoordinator && !$scope.coordinatorHasEnhancedPriveledges)) {
                    qaFlagCol['enableCellEdit'] = false;
                }

                gridOptions.columnDefs.push(qaFlagCol);

                

                gridOptions.columnDefs.push(
                   {
                       field: 'CheckCount',
                       name: 'Check Count',
                       headerCellClass: $scope.highlightFilteredHeader,
                       cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                           return row.entity.edited ? 'gridCellEdited' : '';
                       }
                   }
                );
                
                    gridOptions.columnDefs.push(
                       {
                           field: 'SampleSetId',
                           name: 'Sample Set Id',
                           visible: false,
                           cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                               return row.entity.edited ? 'gridCellEdited' : '';
                           }
                       }
                    );
                gridOptions.columnDefs.push(
                   {
                       field: 'EventSetId',
                       name: 'Event Set Id',
                       visible: false,
                       cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                           return row.entity.edited ? 'gridCellEdited' : '';
                       }
                   }
                );

            }

            function generateData() {
                var samples = $scope.samples;
                angular.forEach(samples, function (value, index) {
                    var group = value.BenthicEvent.Group.Code;
                    var stationId = value.BenthicEvent.StationId;
                    var stationCode = value.BenthicEvent.Station.Code;
                    var stationName = value.BenthicEvent.Station.Name;
                    var datetime = value.BenthicEvent.DateTime;
                    var qaFlagId = value.QaFlagId;
                    var sampleId = value.SampleId;
                    var parameterName = value.BenthicParameter.Name;

                    var sampleValue = value.Value;
                    var countCheck = '';
                    if (sampleValue > 100) {
                        countCheck = 'Count > than 100';
                    }
                    var sampleSetId = value.Id;
                    var eventSetId = value.BenthicEvent.Id;
                    //var comments = value.Comments;
                    var parameterType = 'WaterQuality';

                    var row = {};
                    angular.forEach(gridOptions.columnDefs, function (v, k) {
                        if (v.field == 'StationCode') {
                            row[v.field] = stationCode;
                        } else if (v.field == 'ParameterName') {
                            row[v.field] = parameterName;
                        } else if (v.field == 'Value') {
                            row[v.field] = sampleValue;
                        } else if (v.field == 'QaFlagId') {
                            row[v.field] = qaFlagId;
                        } else if (v.field == 'SampleSetId') {
                            row[v.field] = sampleSetId;
                        } else if (v.field == 'EventSetId') {
                            row[v.field] = eventSetId;
                        } else if (v.field == 'ParameterType') {
                            row[v.field] = parameterType;
                        } else if (v.field == 'CheckCount') {
                            row[v.field] = countCheck;
                        }
                    });



                    gridOptions.data.push(row);
                });
                
                $scope.gettingFilteredSamples = false;
                $scope.showGrid = true;
            }

            function createGridOptions() {
                gridOptions = {
                    enableFiltering: true,
                    enableSorting: true,
                    enableGridMenu: true,
                    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                    exporterCsvFilename: 'wqDownload.csv',
                    exporterMenuPdf: false,
                    fastWatch: true,
                    multiSelect: true,
                    columnDefs: [],
                    data: []
                };
                generateColumns();
                generateData();

                $scope.gridOptions = gridOptions;
                for (var i = 0; i < $scope.gridOptions.columnDefs.length; i++) {
                    if ($scope.gridOptions.columnDefs[i].field !== 'Delete') {
                        $scope.gridOptions.columnDefs[i].width = '180';
                    } else {
                        $scope.gridOptions.columnDefs[i].width = '22';
                    }
                }
            }

            createGridOptions();

            $scope.gridOptions.onRegisterApi = function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    //Do your REST call here via $http.get or $http.post
                    if (newValue != oldValue) {
                        if (colDef.name !== 'Station' && colDef.name !== 'Sample Time') {
                            var patchData = {};
                            rowEntity.edited = true;
                            if (colDef.name == 'Value' && newValue > 100) {
                                rowEntity.CheckCount = 'Count > than 100';
                            } else {
                                rowEntity.CheckCount = '';
                            }
                            gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                            patchData[colDef.field] = newValue;
                            return (new benthicSampleService(patchData)).$patch({ key: rowEntity.SampleSetId })
                            .then(function (data) {
                                rowEntity.edited = false;
                                gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);

                            });
                        }
                    }
             
                });

            };



        }


        $scope.fillMonitorGrid = function () {
            var monitorGridOptions = {};
            function generateColumns() {
                monitorGridOptions.columnDefs.push(
                 {
                     field: 'MonitorLogId',
                     name: 'MonitorLogId',
                     visible: false,
                     enableCellEdit: false,
                     sortCellFiltered: true
                 }
                );

                monitorGridOptions.columnDefs.push(
                  {
                      field: 'UserId',
                      name: 'UserId',
                      visible:false,
                      enableCellEdit: false,               
                      sortCellFiltered: true
                  }
                );
                monitorGridOptions.columnDefs.push(
                  {
                      field: 'UserName',
                      name: 'User',
                      enableCellEdit: false,
                      sortCellFiltered: true
                  }
                );
                monitorGridOptions.columnDefs.push(
                    {
                        field: 'Hours',
                        name: 'Hours',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return row.entity.edited ? 'gridCellEdited' : '';
                        }
                       
                    }
                );               

            }
            function generateData() {
                var monitors = [];
                if ($scope.monitors.length > 0) {
                    angular.forEach($scope.monitors, function (value, index) {
                        monitors.push({
                            Id: value.MonitorLogId,
                            User: value.Id,
                            Hours: value.Hours,
                            Name: value.Name

                        })

                    });
                    angular.forEach(monitors, function (value, index) {
                        $log.log(value);
                        var user = value.User;
                        var hours = value.Hours;
                        var id = value.Id;
                        var name = value.Name;

                        var row = {};
                        row['MonitorLogId'] = id;
                        row['UserId'] = user;
                        row['Hours'] = hours;
                        row['UserName'] = name;



                        monitorGridOptions.data.push(row);

                    });
                }

            }

            function createGridOptions() {
                monitorGridOptions = {
                    enableFiltering: true,
                    enableRowSelection:false,
                    enableSorting: true,
                    enableGridMenu: true,
                    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                    exporterCsvFilename: 'wqMonitorsDownload.csv',
                    exporterMenuPdf: false,
                    fastWatch: true,
                    columnDefs: [],
                    data: []
                };
                generateColumns();
                generateData();

                $scope.monitorGridOptions = monitorGridOptions;
                for (var i = 0; i < $scope.monitorGridOptions.columnDefs.length; i++) {
                    $scope.monitorGridOptions.columnDefs[i].width = '150';
                }
            }

            createGridOptions();

            $scope.monitorGridOptions.onRegisterApi = function (gridApi) {

                $scope.monitorGridApi = gridApi;
                
                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    if (newValue != oldValue) {
                        var monitorFields = ['H', 'DateTime', 'Comments'];
                        rowEntity.edited = true;
                        $log.log(rowEntity);
                        gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                        var patchData = {};

                        patchData[colDef.field] = newValue;
                        return (new benthicMonitorLogService(patchData)).$patch({ key: rowEntity.MonitorLogId })
                        .then(function (data) {
                            finished();
                        });
                       
                        function finished() {
                            
                            rowEntity.edited = false;
                            angular.forEach(monitorGridOptions.data, function (v, i) {
                                if (v.MonitorLogId == rowEntity.MonitorLogId) {
                                    monitorGridOptions.data[i][colDef.field] = newValue;
                                }
                            })
                            gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                        }


                        //alert('changed');
                    }

                    //Alert to show what info about the edit is available
                    //alert('Column: ' + colDef.name + ' ID: ' + rowEntity.id + ' Name: ' + rowEntity.sampleDepth + ' Age: ' + rowEntity.age);                    
                });
            };
        }   


        $scope.fillEventGrid = function () {
            var eventGridOptions = {};
            $scope.eventStationsList = [];
            $scope.eventStationIds = [];
            function generateColumns() {


                eventGridOptions.columnDefs.push(
                  {
                      field: 'StationName',
                      name: 'Station',
                      filter: {
                          type: uiGridConstants.filter.SELECT,
                          selectOptions: $scope.eventStationsList
                      },
                      enableCellEdit: false,                      
                      cellFilter: 'griddropdown:this',
                      sortCellFiltered: true
                  }
               );
                eventGridOptions.columnDefs.push(
                    {
                        field: 'StationCode',
                        name: 'Station Code',
                        visible: false,
                        enableCellEdit: false
                       
                    }
                );
                eventGridOptions.columnDefs.push(
                    {
                        field: 'DateTime',
                        name: 'Sample Time',
                        //type: 'date',
                        enableCellEdit: false,
                        cellTemplate: '<span class="gridCellCenterText"> {{row.entity.DateTime | date:\'MM/dd/yyyy hh:mm a\':\'UTC\'}}</span>',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return row.entity.edited ? 'gridCellEdited' : '';
                        },
                        enableFiltering: false
                    }
                );

                angular.forEach($scope.conditions, function (v, k) {
                    var categories = [];
                    if (v.isCategorical) {                        
                        angular.forEach($scope.conditionCategories, function (value, key) {                            
                            if (v.Id == value.ConditionId) {
                                categories.push({ value: value.Category, label: value.Category })
                            }
                        });
                        eventGridOptions.columnDefs.push(
                        {
                            field: v.Id.toString(),
                            name: v.Name,

                            filter: {
                                type: uiGridConstants.filter.SELECT,
                                selectOptions: categories
                            },
                            editableCellTemplate: 'ui-grid/dropdownEditor',
                            cellFilter: 'griddropdown:this',
                            sortCellFiltered: true,
                            cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                return row.entity.edited ? 'gridCellEdited' : '';
                            },
                            editDropdownValueLabel: 'label',
                            editDropdownIdLabel: 'value',
                            editDropdownOptionsArray: categories
                        });
                    }else{                    
                        eventGridOptions.columnDefs.push(
                        {
                            field: v.Id.toString(),
                            name: v.Name,
                            cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                                return row.entity.edited ? 'gridCellEdited' : '';
                            }
                        });
                    }
                });

                eventGridOptions.columnDefs.push(
                   {
                       field: 'Comments',
                       name: 'Comments',
                       cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                           return row.entity.edited ? 'gridCellEdited' : '';
                       }
                   }
                );

                eventGridOptions.columnDefs.push(
                   {
                       field: 'EventSetId',
                       name: 'Event Set Id',
                       visible: false,
                       cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                           return row.entity.edited ? 'gridCellEdited' : '';
                       }
                   }
                );

            }


            function generateData() {
                
                var uniqueEvents = [];
                var events = [];
                $log.log('events');
                $log.log($scope.events);
                angular.forEach($scope.events, function (value, index) {
                    var benthicConditions = [];
                    if (value.BenthicEventConditions.length > 0) {
                        angular.forEach(value.BenthicEventConditions, function (v, k) {
                            $log.log('value');
                            $log.log(v.Value);
                            var benthicCondition = {
                                ConditionId: v.BenthicCondition.Id,
                                Value: v.Value,
                                Name: v.BenthicCondition.Name
                            }
                            benthicConditions.push(benthicCondition);
                        });
                    }
                        
                    events.push({
                        Group: {
                            Id: value.Group.Id,
                            Code: value.Group.Code,
                            Name: value.Group.Name
                        },
                        Station: {
                            Id: value.Station.Id,
                            Code: value.Station.Code,
                            Name: value.Station.Name
                        },
                        DateTime: value.DateTime,
                        EventSetId: value.Id,
                        Comments: value.Comments,
                        BenthicCondition: benthicConditions
                    });
                    
                    
                    
                   
                    
                });
                $log.log(events);
                angular.forEach(events, function (value, index) {

                    var group = value.Group.Code;
                    var stationId = value.Station.Id;
                    var stationCode = value.Station.Code;
                    var stationName = value.Station.Name;
                    //var qaFlagId = value.QaFlagId;
                    var datetime = value.DateTime;
                    var eventSetId = value.EventSetId;
                    if ($scope.eventStationIds.indexOf(stationId) == -1) {
                        $scope.eventStationIds.push(stationId);
                        $scope.eventStationsList.push({ value: stationName, label: stationName });
                    }
                    var comments = value.Comments;

                    var row = {};
                    row['StationCode'] = stationCode;
                    row['StationName'] = stationName;
                    row['DateTime'] = datetime;
                    row['Comments'] = comments;
                    row['EventSetId'] = eventSetId;
                        
                    $log.log('bc');

                    angular.forEach(value.BenthicCondition, function (v, k) {
                        $log.log(v);
                        if (typeof v.Value !== 'undefined') {
                            row[v.ConditionId.toString()] = v.Value;
                        }
                    });
                    eventGridOptions.data.push(row);
                    $scope.gettingFilteredEvents = false;
                    $scope.showEventGrid = true;
                });

            }

            function createGridOptions() {
                eventGridOptions = {
                    enableFiltering: true,
                    enableSorting: true,
                    enableGridMenu: true,
                    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                    exporterCsvFilename: 'wqEventsDownload.csv',
                    exporterMenuPdf: false,
                    fastWatch: true,
                    multiSelect: true,
                    columnDefs: [],
                    data: []
                };
                generateColumns();
                generateData();

                $scope.eventGridOptions = eventGridOptions;
                for (var i = 0; i < $scope.eventGridOptions.columnDefs.length; i++) {
                    $scope.eventGridOptions.columnDefs[i].width = '150';
                }
            }

            createGridOptions();

            $scope.eventGridOptions.onRegisterApi = function (gridApi) {

                $scope.eventGridApi = gridApi;
                
                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    if (newValue != oldValue) {
                        var eventFields = ['StationId', 'DateTime', 'Comments'];
                        rowEntity.edited = true;
                        gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                        var patchData = {};
                        if (eventFields.indexOf(colDef.field) > -1) {
                                                

                            patchData[colDef.field] = newValue;
                            return (new benthicEventService(patchData)).$patch({ key: rowEntity.EventSetId })
                            .then(function (data) {
                                finished();
                            });
                        } else {
                            return new benthicEventConditionService().$getByEventIdAndConditionId({ benthicConditionId: parseInt(colDef.field), benthicEventId: rowEntity.EventSetId })
                            .then(function (response) {
                                if (response.value.length > 0) {
                                    if (newValue !== null && newValue !== '') {

                                        patchData['Value'] = newValue;
                                        return (new benthicEventConditionService(patchData)).$patch({ key: response.value[0].Id })
                                        .then(function (data) {
                                            finished();
                                        });
                                    } else {
                                        return (new benthicEventConditionService()).$remove({ key: response.value[0].Id })
                                        .then(function (data) {
                                            finished();

                                        });
                                    }
                                } else {
                                    var benthicEventCondition = {
                                        BenthicEventId: rowEntity.EventSetId,
                                        BenthicConditionId: parseInt(colDef.field),
                                        Value: newValue
                                    }
                                    return (new benthicEventConditionService(benthicEventCondition)).$save()
                                    .then(function (data) {
                                        finished();

                                    });

                                }
                            });

                            function finished() {
                                var row = $scope.eventGridApi.selection.getSelectedRows();
                                if (row.length == 1) {
                                    if ((row[0].EventSetId == rowEntity.EventSetId) && ($scope.showGrid == true)) {
                                        $scope.getSelectedEvent(row);
                                    }
                                }
                                rowEntity.edited = false;
                                angular.forEach(eventGridOptions.data, function (v, i) {
                                    if (v.EventSetId == rowEntity.EventSetId) {
                                        eventGridOptions.data[i][colDef.field] = newValue;
                                    }
                                })
                                gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                            }
                        }


                        //alert('changed');
                    }

                    //Alert to show what info about the edit is available
                    //alert('Column: ' + colDef.name + ' ID: ' + rowEntity.id + ' Name: ' + rowEntity.sampleDepth + ' Age: ' + rowEntity.age);                    
                });
                gridApi.selection.on.rowSelectionChanged($scope, function (eRow) {
                    $scope.showNoSamplesMsg = false;
                    var row = $scope.eventGridApi.selection.getSelectedRows();
                    if (row.length == 1) {
                        $scope.row = row;
                        $scope.showEditEventBtn = true;

                    } else {
                        $scope.row = null;
                        $scope.showGrid = false;
                        $scope.editEvent = {};
                        $scope.editSample = {};
                        $scope.showEditEventBtn = false;
                        $scope.showSelectMsg = false;
                        $scope.editEventLoadingDone = false;
                        $scope.editEventLoading = false;
                    }
                });
            };

        }

        $scope.getSelectedEvent = function (row) {
            if (typeof row[0] !== 'undefined') {
                $scope.noMonitorData = false;
                $scope.gettingFilteredSamples = true;
                
                var id = row[0].EventSetId;
                $scope.getMonitorLogsByEventId(id);
                return (new benthicSampleService()).$getByEventIdForEdit({
                    key: id
                }).then(function (data) {
                    if (data.value.length > 0) {
                        populateSamples(data, id);
                    } else {
                        $scope.gettingFilteredSamples = false;
                        $scope.showGrid = false;
                        $scope.showNoSamplesMsg = true;
                    }

                })
                
            };
            function populateSamples(data, eventId) {

                $scope.samples = data.value;

                return (new benthicEventConditionService()).$getByEventId({
                    key: id
                }).then(function (data) {
                    $scope.eventConditions = data.value;

                    $scope.fillGrid();
                });

            }
            
        }
    }
    benthicSamplesEditController.$inject = ['$scope', 'uiGridConstants', '$log', 'notificationFactory',
                                    '$q', '$filter', '$timeout', 'stationGroupService', 'benthicParameterService', 'benthicEventService',
                                    'qaFlagService', 'benthicSampleService', 'benthicMonitorLogService',
                                    'benthicConditionService', 'benthicEventConditionService', 'benthicConditionCategoriesService', 
                                    'userGroupId', 'userRole', 'userId', 'userName', 'userGroup','oData',
                                    'groupService'];
    app.controller("benthicSamplesEditController", benthicSamplesEditController)
        
}(angular.module("cmcApp")));