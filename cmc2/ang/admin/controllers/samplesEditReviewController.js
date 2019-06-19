(function (app) {
    var samplesEditReviewController = function ($scope, uiGridConstants, $log, notificationFactory, 
                                    $q, $filter,stationGroupService, parameterService, eventService,
                                    qaFlagService, sampleService, problemService, qualifierService,
                                    conditionService,eventConditionService, conditionCategoriesService,
                                    userGroupId, userRole, userId, userName, userGroup,
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
            
            $scope.userGroup = userGroup;
            $scope.userName = userName;
            $scope.togglePlot = true;
            $scope.showSelectMsg = false;
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
                $scope.stationId = $scope.stations[0].Station.Id;
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

                $scope.problemsList = [];
                $scope.problems = values[5].value;
                angular.forEach($scope.problems, function (value, key) {
                    $scope.problemsList.push(
                        {
                            value: value.Id,
                            label: value.Code
                        }
                    );
                });

                $scope.qualifiersList = [];
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
            return (new groupService()).$getAll();
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

        $scope.getSamples = function (grpId) {
            return (new sampleService()).$getByGroup({
                groupId: grpId            
            }).then(function (data) {
                $scope.samples = data.value;
                if ($scope.samples.length > 0) {
                    $scope.hideNoSamplesForStation = true;
                    $scope.fillGrid();
                } else {
                    $scope.hideNoSamplesForStation = false;
                    $scope.fillGrid();
                }
            })
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


        $scope.$watch('slctGroupId', function (newValue, oldValue) {
            if (newValue != null) {
                $scope.populateStationsDropdown(newValue);
                $scope.getSamples(newValue);
            }
        });

        $scope.$watch('stationId', function (newValue, oldValue) {
            if (newValue != null) {
                $scope.samples = [];
                
            }
        });
        

        $scope.populateStationsDropdown = function (grpId) {
            return (new stationGroupService()).$getStationsByGroupId({ key: grpId })
            .then(function (data) {
                if (data.value.length > 0) {
                    $scope.hideNoStationForGroup = true
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
        $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        }

        $scope.deleteDialogue = function (sampleId) {
            $scope.deleteSampleId = sampleId;
        }

        $scope.deleteSample = function (sampleId) {
            return (new sampleService()).$remove({ key: sampleId})
            .then(function (data) {
                $log.log(data);
                notificationFactory.success('Samples deleted successfully', 'Samples Deleted!');
                $('#deleteModal').modal('hide');
            });
        }

        $scope.fillGrid = function () {
            var gridOptions = {};

            function generateColumns() {
                gridOptions.columnDefs.push(
                       {
                           field: 'Delete',
                           name: '',                           
                           cellTemplate: '<span title="Delete Row" data-toggle="tooltip" ><button type="button" class="btn btn-danger btn-circle btn-sm gridCellCenter" data-toggle="modal" data-target="#deleteModal" ' +
                               'ng-click="grid.appScope.deleteDialogue(row.entity.SampleSetId)">' +
                               '<i  class="fa fa-times"></i></button></span>',
                           enableFiltering: false
                       }
                    );
                gridOptions.columnDefs.push(
                  {
                      field: 'StationId',
                      name: 'Station',
                      filter: {
                          type: uiGridConstants.filter.SELECT,
                          selectOptions: $scope.stationsList
                      },
                      editableCellTemplate: 'ui-grid/dropdownEditor',
                      cellFilter: 'griddropdown:this',
                      sortCellFiltered: true,
                      cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                          return row.entity.edited ? 'gridCellEdited' : '';
                      },
                      editDropdownValueLabel: 'name',
                      editDropdownIdLabel: 'value',
                      editDropdownOptionsArray: $scope.stationsList
                  }
               );
                gridOptions.columnDefs.push(
                    {
                        field: 'StationCode',
                        name: 'Station Code',
                        visible: false,
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return row.entity.edited ? 'gridCellEdited' : '';
                        }
                    }
                );
                gridOptions.columnDefs.push(
                    {
                        field: 'DateTime',
                        name: 'Sample Time',
                        //type: 'date',
                        cellTemplate: '<span class="gridCellCenterText"> {{row.entity.DateTime | date:\'MM/dd/yyyy hh:mm a\':\'UTC\'}}</span>',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return row.entity.edited ? 'gridCellEdited' : '';
                        }
                    }
                );
                gridOptions.columnDefs.push(
                    {
                        field: 'Depth',
                        name: 'Sample Depth',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return row.entity.edited ? 'gridCellEdited' : '';
                            
                        }
                    }
                );
                gridOptions.columnDefs.push(
                    {
                        field: 'SampleId',
                        name: 'Sample Id',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return row.entity.edited ? 'gridCellEdited' : '';
                        }
                    }
                );
                gridOptions.columnDefs.push(
                    {
                        field: 'ParameterName',
                        name: 'Parameter Name',
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            return row.entity.edited ? 'gridCellEdited' : '';
                        }
                    }
                );
                gridOptions.columnDefs.push(
                   {
                       field: 'Value',
                       name: 'Value',
                       headerCellClass: $scope.highlightFilteredHeader,
                       cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                           return row.entity.edited ? 'gridCellEdited' : '';
                       }
                   }
                );
                gridOptions.columnDefs.push(
                   {
                       field: 'QualifierId',
                       name: 'Qualifier',
                       filter: {
                           type: uiGridConstants.filter.SELECT,
                           selectOptions: $scope.qualifiersList
                       },
                       editableCellTemplate: 'ui-grid/dropdownEditor',
                       cellFilter: 'griddropdown:this',
                       sortCellFiltered: true,
                       cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                           return row.entity.edited ? 'gridCellEdited' : '';
                       },
                       editDropdownValueLabel: 'name',
                       editDropdownIdLabel: 'value',
                       editDropdownOptionsArray: $scope.qualifiersList
                   }
                );
                gridOptions.columnDefs.push(
                   {
                       field: 'ProblemId',
                       name: 'Problem',
                       filter: {
                           type: uiGridConstants.filter.SELECT,
                           selectOptions: $scope.problemsList
                       },
                       editableCellTemplate: 'ui-grid/dropdownEditor',
                       cellFilter: 'griddropdown:this',
                       sortCellFiltered: true,
                       cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                           return row.entity.edited ? 'gridCellEdited' : '';
                       },
                       editDropdownValueLabel: 'label',
                       editDropdownIdLabel: 'value',
                       editDropdownOptionsArray: $scope.problemsList
                       
                   }
                );
                gridOptions.columnDefs.push(
                   {
                       field: 'Comments',
                       name: 'Comments',
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
                    var group = value.Event.Group.Code;
                    var stationId = value.Event.StationId;
                    var stationCode = value.Event.Station.Code;
                    var stationName = value.Event.Station.Name;
                    var datetime = value.Event.DateTime;
                    var depth = value.Depth;
                    var sampleId = value.SampleId;
                    var parameterName = value.Parameter.Name;
                    var sampleValue = value.Value;
                    var sampleSetId = value.Id;
                    var eventSetId = value.Event.Id;
                    if (value.Qualifier !== null) {
                        var qualifier = value.QualifierId;
                    }
                    if (value.Problem !== null) {
                        $log.log(value.ProblemId);
                        var problem = value.ProblemId;
                    }
                    var comments = value.Comments;

                    var row = {};
                    angular.forEach(gridOptions.columnDefs, function (v, k) {
                        if (v.field == 'StationCode') {
                            row[v.field] = stationCode;
                        } else if (v.field == 'StationId') {
                            row[v.field] = stationId;
                        } else if (v.field == 'DateTime') {
                            row[v.field] = datetime;
                        } else if (v.field == 'Depth') {
                            row[v.field] = depth;
                        } else if (v.field == 'SampleId') {
                            row[v.field] = sampleId;
                        } else if (v.field == 'ParameterName') {
                            row[v.field] = parameterName;
                        } else if (v.field == 'Value') {
                            row[v.field] = sampleValue;
                        } else if (v.field == 'QualifierId') {
                            row[v.field] = qualifier;
                        } else if (v.field == 'ProblemId') {
                            row[v.field] = problem;
                        } else if (v.field == 'Comments') {
                            row[v.field] = comments;
                        } else if (v.field == 'SampleSetId') {
                            row[v.field] = sampleSetId;
                        } else if (v.field == 'EventSetId') {
                            row[v.field] = eventSetId;
                        }
                    });
                    gridOptions.data.push(row);
                });
               
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
                    $log.log(rowEntity);
                    if (newValue != oldValue) {
                        $log.log(colDef);
                        if (colDef.name !== 'Station' && colDef.name !== 'Sample Time') {
                            var patchData = {};
                            rowEntity.edited = true;
                            gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                            patchData[colDef.field] = newValue;
                            return (new sampleService(patchData)).$patch({ key: rowEntity.SampleSetId })
                            .then(function (data) {
                                $log.log(data);
                                rowEntity.edited = false;
                                gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                            });
                        } else if (colDef.name === 'Sample Time' | colDef.name ==='Station') {
                            var patchData = {};
                            rowEntity.edited = true;
                            gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                            patchData[colDef.field] = newValue;
                            return (new eventService(patchData)).$patch({ key: rowEntity.EventSetId })
                            .then(function (data) {
                                $log.log(data);
                                rowEntity.edited = false;
                                $log.log(gridOptions.data);
                                angular.forEach(gridOptions.data, function (v, i) {
                                    if (v.EventSetId == rowEntity.EventSetId) {
                                        gridOptions.data[i][colDef.field] = newValue;
                                    }
                                })
                                gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                            });
                        } 
                       
                        
                        //alert('changed');
                    }

                    //Alert to show what info about the edit is available
                    //alert('Column: ' + colDef.name + ' ID: ' + rowEntity.id + ' Name: ' + rowEntity.sampleDepth + ' Age: ' + rowEntity.age);                    
                });
                
            };

 
           
 
        }
    }
    
    ;
    samplesEditReviewController.$inject = ['$scope', 'uiGridConstants', '$log', 'notificationFactory',
                                    '$q', '$filter', 'stationGroupService', 'parameterService', 'eventService',
                                    'qaFlagService', 'sampleService', 'problemService', 'qualifierService',
                                    'conditionService', 'eventConditionService', 'conditionCategoriesService',
                                    'userGroupId', 'userRole', 'userId', 'userName', 'userGroup',
                                    'groupService'];
    app.controller("samplesEditReviewController", samplesEditReviewController)
        
}(angular.module("cmcApp")));