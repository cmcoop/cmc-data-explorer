(function (app) {
    var queryController = function ($scope, stationService, leafletMapEvents, leafletData, $q, $log, $http, $filter,
        groupService, parameterService, benthicParameterService, stationGroupService, parameterGroupService, relatedParameterService,
        $timeout, FileSaver, Blob, $state, $stateParams, $location,$rootScope) {

        $scope.$watch(function () {
            return $state.$current
        }, function (newVal, oldVal) {
            $scope.current = newVal;
            //do something with values
        })
        function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }
        $scope.initialize = function () {
            
            angular.element('body').removeClass('modal-open');
            angular.element('.modal-backdrop').remove();
            $scope.showWatershedFilters = false;
            $scope.showPoliticalFilters = false;
            $scope.downloading = false;
            $scope.loading = false;
            $scope.startDate = null;
            $scope.endDate = null;
            $scope.dateWarning = false;
            $scope.showParamInfo = false;
            $scope.stateParams = $stateParams;
            $scope.loaded = false;
            $scope.metadata = {
                includeParameters: false,
                includeGroups: false,
                includeStations: false,
                includeCalibration: false
            };

            var promises = [
                $scope.getStations(),
                $scope.getGroups(),
                $scope.getParameters(),
                $scope.getStationGroups(),
                $scope.getParameterGroups(),
                $scope.getBenthicParameters(),
                $scope.getBenthicStations()
            ]
            $q.all(promises)
            .then(function (values) {

                $scope.geographyList = [                   
                    {
                        value: 'Watershed',
                        name: 'Watershed Boundary'
                    },
                    {
                        value: 'Political',
                        name: 'Political Boundary'
                    }
                ]
                $scope.slctGeography = 'Political';


                $scope.dataTypeList = [
                    {
                        value: 'waterQuality',
                        name: 'Water Quality'
                    },
                    {
                        value: 'benthic',
                        name: 'Benthic Macroinvertebrates'
                    }
                ]
                $scope.dataType = 'waterQuality';


                $scope.stationsList = [];
                $scope.stations = values[0].data;
                
                $scope.benthicStationsList = [];
                $scope.benthicStations = values[6].data;
                $log.log('benthicStns');
                $log.log($scope.benthicStations);
                

                $scope.statesList = [];
                $scope.cityCountyList = [];
                $scope.huc6List = [];
                $scope.huc12List = [];
                
                

                $scope.groupsList = [];
                $scope.groups = values[1].value;
               
                

                
                $scope.parameterList = [];

                    
                $scope.wqParameters = values[2].value;
                $scope.benthicParameters = values[5].value;
                $log.log('benthicparams');
                $log.log($scope.benthicParameters);
                

                $scope.stationGroups = values[3].value;

                $scope.parameterGroups = values[4].value;

                var flagHuc6 = [], flagHuc12 = [],flagState = [];
                $scope.stations.forEach(function (v, k) {                    
                    if (!flagHuc6[v.Huc6Name]) {
                        flagHuc6[v.Huc6Name] = true;
                        $scope.huc6List.push(
                            {
                                value: v.Huc6Name,
                                name: v.Huc6Name
                            }
                        );
                    }
                    //if (!flagHuc12[v.WaterBody]) {
                    //    flagHuc12[v.WaterBody] = true;
                    //    $scope.huc12List.push(
                    //        {
                    //            value: v.WaterBody,
                    //            name: v.WaterBody
                    //        }
                    //    );
                    //}
                    if (!flagState[v.State]) {
                        flagState[v.State] = true;
                        $scope.statesList.push(
                            {
                                value: v.State,
                                name: v.State
                            }
                        );
                    }
                })
                
                
                if ($stateParams.dataType == null) {
                    $scope.dataType = 'waterQuality';
                } else {
                    if ($stateParams.dataType == 'wq') {
                        $scope.dataType = 'waterQuality';
                    } else {
                        $scope.dataType = 'benthic';
                    }
                    $timeout(function () {
                        $('.selectpicker').selectpicker('refresh');
                    }, 1);
                }

                if ($stateParams.parameterId == null | $stateParams.dataType == 'benthic') {
                    $scope.slctParameterId = [null];
                } else {
                    angular.forEach($scope.wqParameters, function (v, k) {
                        $log.log('param');
                        $log.log(v);
                        $log.log($stateParams.parameterId);
                        if (v.Id == $stateParams.parameterId) {
                            $scope.slctParameterId = [v.Name];
                        }
                    })
                    //$scope.slctParameterId = [$stateParams.parameterId];
                    $timeout(function () {
                        $('.selectpicker').selectpicker('refresh');
                    }, 1);
                }
                if ($stateParams.groupId == null) {
                    $scope.slctGroupId = [null];
                } else {
                    $scope.slctGroupId = [$stateParams.groupId];
                }
                if ($stateParams.stationId == null) {
                    $scope.slctStationId = [null];
                } else {
                    $scope.slctStationId = [parseInt($stateParams.stationId)];
                    $timeout(function () {
                        $('.selectpicker').selectpicker('refresh');
                    }, 1);
                }
                if ($stateParams.startDate == null) {
                    $scope.startDate = null;
                } else {
                    $scope.startDate = $stateParams.startDate;
                }
                if ($stateParams.endDate == null) {
                    $scope.endDate = null;
                } else {
                    $scope.endDate = $stateParams.endDate;
                }
                $scope.slctState = [];
                $scope.slctCityCounty = [];
                $scope.slctHuc6 = [];
                $scope.slctHuc12 = [];
                $scope.buildFilters('none');
                $scope.loaded = true;
                //$scope.clearFilters();
            });
        };

        $scope.getStations = function () {
           // return (new stationService()).$getGetStationRichness();
            return $http({ method: 'GET', url: 'odata/GetStationRichness' }).success(function (data, status, headers, config) {
                return data;
            });
        }

         $scope.getBenthicStations = function () {
             // return (new stationService()).$getGetStationRichness();
            return $http({ method: 'GET', url: 'odata/GetBenthicStationRichness' }).success(function(data, status, headers, config) {
                return data;
            });
        }
        $scope.getParameters = function () {
            return (new parameterService()).$getAllWaterQuality();
        }

        $scope.getBenthicParameters = function () {
            return (new benthicParameterService()).$getAll();
        }

        $scope.getGroups = function () {
            return (new groupService()).$getAll();
        }

        $scope.getStationGroups = function () {
            return (new stationGroupService()).$expandAll();
        }

        $scope.getParameterGroups = function () {
            return (new parameterGroupService()).$expandAllWaterQuality();
        }


        $scope.getResults = function () {
            $scope.downloading = true;
            
            var dataWithHeaders = [];
            
            var startDate;
            var endDate;           

            
            var deferred = $q.defer();
            if ($scope.startDate !== null) {
                startDate =$scope.startDate;
            } else {
                startDate = "1900-01-01";;
            }

            if ($scope.endDate !== null) {
                endDate = $scope.endDate;
            } else {
                endDate = moment(new Date()).format("YYYY-MM-DD");
                
            }

            var parameterIds = null, groupIds = null, stationIds = null, state = null, cityCounty = null, huc6 = null, huc12 = null;
            if ($scope.slctGroupId[0] !== null && $scope.slctGroupId.length !== 0) {
                groupIds = "," + $scope.slctGroupId;
            } 
            if ($scope.slctParameterId[0] !== null && $scope.slctParameterId.length !== 0) {
                var parameters = [];
                if ($scope.dataType == 'waterQuality') {
                    $scope.slctParameterId.forEach(function (value, key) {
                        $scope.wqParameters.forEach(function (v, k) {
                            if (value == v.Name) {
                                parameters.push(v.Id);
                            }
                        })
                    })
                } else {
                    $scope.slctParameterId.forEach(function (value, key) {
                        $scope.benthicParameters.forEach(function (v, k) {
                            if (value == v.Name) {
                                parameters.push(v.Id);
                            }
                        })
                    })
                }
                parameterIds = "," + parameters ;
            } 
            if ($scope.slctStationId[0] !== null && $scope.slctStationId.length !== 0) {
                stationIds = "," + $scope.slctStationId;
            } 
            if ($scope.slctState[0] !== null && $scope.slctState.length !== 0) {
                state =  ","  + $scope.slctState;
            }
            if ($scope.slctCityCounty[0] !== null && $scope.slctCityCounty.length !== 0) {
                cityCounty = "," + $scope.slctCityCounty;
            }
            if ($scope.slctHuc6[0] !== null && $scope.slctHuc6.length !== 0) {
                huc6 = "," + $scope.slctHuc6;
            }
            if ($scope.slctHuc12[0] !== null && $scope.slctHuc12.length !== 0) {
                huc12 = "," + $scope.slctHuc12;
            }
            var requestUrl = "odata/GetSamplesDownloadPublic";
            if ($scope.dataType == 'benthic') {
                requestUrl = "odata/GetBenthicSamplesDownloadPublic";
            } 

            var req = {
                method: 'POST',
                url: requestUrl,
                data: {
                    state: state,
                    cityCounty: cityCounty,
                    huc6: huc6,
                    huc12: huc12,
                    groupId: groupIds,
                    parameterId: parameterIds,
                    stationId: stationIds,
                    startDate: startDate,
                    endDate: endDate
                }
            }

            
            $http(req).success(function (data, status, headers, config) {
            
                $scope.data = data;
                var headers = {};
                var excludeIndex =[];
                angular.forEach(data[0], function (value, index) {
                    if (index !== 'GroupId' && index !== 'StationId') {
                        $log.log('index');
                        $log.log(index);
                        if (index == 'Value') {
                            if ($scope.dataType == 'benthic') {
                                headers[index] = 'Count';
                            } else {
                                headers[index] = 'Value';
                            }
                        } else if (index == 'Name') {
                            if ($scope.dataType == 'benthic') {
                                headers[index] = 'Benthic Classification Name';
                            } else {

                                headers[index] = 'Parameter Name';
                            }
                        } else if (index == 'ParameterCode') {
                            if ($scope.dataType == 'benthic') {
                                headers[index] = 'Benthic Classification Code';
                            } else {
                                headers[index] = 'Parameter Code';
                            }
                        } else {
                            headers[index] = index;
                        }
                    } else {
                        excludeIndex.push(index)
                    }
                });
                dataWithHeaders.push(headers);
                angular.forEach(data, function (value, index) {
                    var row = [];
                    angular.forEach(value, function (v, i) {
                        if (excludeIndex.indexOf(i) == -1) {
                            row.push(v);
                        }
                    });
                    dataWithHeaders.push(row);
                    
                });

                deferred.resolve(dataWithHeaders);
                $scope.downloading = false;
                setTimeout(function () {
                    var flagStationIds = []; var stationIds = ''; var flagGroupIds = []; var groupIds = ''; var flagParameterCode = []; var parameterIds = '';
                    data.forEach(function (v, k) {
                        if ($scope.metadata.includeGroups) {
                            if (!flagGroupIds[v.GroupId]) {
                                flagGroupIds[v.GroupId] = true;
                                groupIds = groupIds + "," + v.GroupId;

                            }
                        }
                        if ($scope.metadata.includeStations) {
                            if (!flagStationIds[v.StationId]) {
                                flagStationIds[v.StationId] = true;
                                stationIds = stationIds + "," + v.StationId;
                            }
                        }
                        if ($scope.metadata.includeParameters && $scope.dataType == 'waterQuality') {
                            Object.keys(v).forEach(function (c, i) {
                                var lastFour = c.slice(-4);
                                if (lastFour == 'Code') {
                                    if (!flagStationIds[v[c]] && v[c] !== null) {
                                        flagStationIds[v[c]] = true;
                                        parameterIds = parameterIds + "," + v[c];
                                    }
                                }
                            })
                        }
                    });
                    if ($scope.metadata.includeStations) {
                        $scope.strStationIds = stationIds;
                        angular.element('#btnResultsStations').triggerHandler('click');
                    }
                    if ($scope.metadata.includeGroups) {
                        $scope.strGroupIds = groupIds;
                        angular.element('#btnResultsGroups').triggerHandler('click');
                    }

                    if ($scope.metadata.includeParameters && $scope.dataType == 'waterQuality') {
                        $scope.strParameterIds = parameterIds;
                        angular.element('#btnResultsParameters').triggerHandler('click');
                    }

                    if ($scope.metadata.includeCalibration) {
                        angular.element('#btnResultsCalibration').triggerHandler('click');
                    }
                }, 1);

                
            });
            return deferred.promise;            
        }

        $scope.getResultsCalibration = function () {
            $scope.downloading = true;
            var dataWithHeaders = [];
            var startDate;
            var endDate;
            var deferred = $q.defer();
            if ($scope.startDate !== null) {
                startDate = $scope.startDate;
            } else {
                startDate = "1900-01-01";;
            }

            if ($scope.endDate !== null) {
                endDate = $scope.endDate;
            } else {
                endDate = moment(new Date()).format("YYYY-MM-DD");
            }
            var parameterIds = null, groupIds = null, stationIds = null, state = null, cityCounty = null, huc6 = null, huc12 = null;
            if ($scope.slctGroupId[0] !== null && $scope.slctGroupId.length !== 0) {
                groupIds = "," + $scope.slctGroupId;
            }
            if ($scope.slctParameterId[0] !== null && $scope.slctParameterId.length !== 0) {
                angular.forEach($scope.slctParameterId, function (v, k) {
                    (new relatedParameterService()).$getByWqParameterId({ key: v.Id }).then(function (data) {
                        $log.log(data);
                        $log.log(data.CalibrationParameterId)
                        parameterIds = "," + data.CalibrationParameterId;
                    });
                });
                
            }
            if ($scope.slctStationId[0] !== null && $scope.slctStationId.length !== 0) {
                stationIds = "," + $scope.slctStationId;
            }
            if ($scope.slctState[0] !== null && $scope.slctState.length !== 0) {
                state = "," + $scope.slctState;
            }
            if ($scope.slctCityCounty[0] !== null && $scope.slctCityCounty.length !== 0) {
                cityCounty = "," + $scope.slctCityCounty;
            }
            if ($scope.slctHuc6[0] !== null && $scope.slctHuc6.length !== 0) {
                huc6 = "," + $scope.slctHuc6;
            }
            if ($scope.slctHuc12[0] !== null && $scope.slctHuc12.length !== 0) {
                huc12 = "," + $scope.slctHuc12;
            }

            var requestUrl = "odata/GetSamplesDownloadPublicCalibration";

            var req = {
                method: 'POST',
                url: requestUrl,
                data: {
                    state: state,
                    cityCounty: cityCounty,
                    huc6: huc6,
                    huc12: huc12,
                    groupId: groupIds,
                    parameterId: parameterIds,
                    stationId: stationIds,
                    startDate: startDate,
                    endDate: endDate
                }
            }


            $http(req).success(function (data, status, headers, config) {

                $scope.data = data;
                var headers = {};
                var excludeIndex = [];
                angular.forEach(data[0], function (value, index) {
                    if (index !== 'GroupId' && index !== 'StationId') {
                        headers[index] = index;
                    } else {
                        excludeIndex.push(index)
                    }
                });
                dataWithHeaders.push(headers);
                angular.forEach(data, function (value, index) {
                    var row = [];
                    angular.forEach(value, function (v, i) {
                        if (excludeIndex.indexOf(i) == -1) {
                            row.push(v);
                        }
                    });
                    dataWithHeaders.push(row);

                });

                deferred.resolve(dataWithHeaders);
                $scope.downloading = false;
               
            });
            return deferred.promise;
        }

        $scope.getResultsGroups = function () {
            $scope.downloading = true;
            var dataWithHeaders = [];
            $log.log($scope.strGroupIds);

            var deferred = $q.defer();


            var requestUrl = "odata/GetSamplesDownloadPublicGroups";

            var req = {
                method: 'POST',
                url: requestUrl,
                data: { ids: $scope.strGroupIds}
            }
            $http(req).success(function (data, status, headers, config) {
                $scope.data = data;
                var headers = {};
                var excludeIndex = ['CreatedDate', 'ModifiedDate', 'CreatedBy', 'ModifiedBy', 'Id', 'Status', 'ParametersSampled', 'Logo', 'Status',
                    'BenthicMethod', 'CmcMember', 'CmcMember2', 'CmcMember3', 'cmcQapp', 'coordinatorCanPublish'];
            
                angular.forEach(data[0], function (value, index) {
                    if (excludeIndex.indexOf(index) < 0) {
                        headers[index] = index;
                    }
                });
                dataWithHeaders.push(headers);
                angular.forEach(data, function (value, index) {
                    var row = [];
                    angular.forEach(value, function (v, i) {
                        if (excludeIndex.indexOf(i) == -1) {
                            row.push(v);
                        }
                    });
                    dataWithHeaders.push(row);
                });

                deferred.resolve(dataWithHeaders);
                $scope.downloading = false;
            });
            return deferred.promise;

        }

        $scope.getResultsStations = function () {
            $scope.downloading = true;
            var dataWithHeaders = [];
            $log.log($scope.strStationIds);

            var deferred = $q.defer();
            var requestUrl = "odata/GetSamplesDownloadPublicStations";

            var req = {
                method: 'POST',
                url: requestUrl,
                data: { ids: $scope.strStationIds }
            }
            $http(req).success(function (data, status, headers, config) {
                $scope.data = data;
                var headers = {};
                var excludeIndex = ['CreatedDate','ModifiedDate','CreatedBy','ModifiedBy','Id','Status','StationSamplingMethodId'];
                angular.forEach(data[0], function (value, index) {
                    if (excludeIndex.indexOf(index)<0) {
                        headers[index] = index;
                    } 
                });
                dataWithHeaders.push(headers);
                angular.forEach(data, function (value, index) {
                    var row = [];
                    angular.forEach(value, function (v, i) {
                        if (excludeIndex.indexOf(i) == -1) {
                            row.push(v);
                        }
                    });
                    dataWithHeaders.push(row);
                });

                deferred.resolve(dataWithHeaders);
                $scope.downloading = false;
            });
            return deferred.promise;

        }

        $scope.getResultsParameters = function () {
            $scope.downloading = true;
            var dataWithHeaders = [];

            var deferred = $q.defer();
            var requestUrl = "odata/GetSamplesDownloadPublicParameters";

            var req = {
                method: 'POST',
                url: requestUrl,
                data: { ids: $scope.strParameterIds }
            }
            $http(req).success(function (data, status, headers, config) {
                $scope.data = data;
                var headers = {};
                angular.forEach(data[0], function (value, index) {
                    headers[index] = index;
                });
                dataWithHeaders.push(headers);
                angular.forEach(data, function (value, index) {
                    dataWithHeaders.push(value);
                });

                deferred.resolve(dataWithHeaders);
                $scope.downloading = false;
            });
            return deferred.promise;

        }

        $scope.$watch("dataType", function (newValue, oldValue) {
            $scope.buildFilters('none');
            if (newValue !== oldValue) {
                $scope.metadata = {
                    includeParameters: false,
                    includeGroups: false,
                    includeStations: false,
                    includeCalibration: false
                };


            }
        });

        $scope.$watch("slctGeography", function (newValue, oldValue) {
            if (newValue == 'Watershed') {
                $scope.showWatershedFilters = true;
                $scope.showPoliticalFilters = false;
            } else if (newValue == 'Political') {
                $scope.showWatershedFilters = false;
                $scope.showPoliticalFilters = true;                
            } 
        });

        $scope.$watch("slctState", function (newValue, oldValue) {
            $scope.filterByState(newValue);
        });
        $scope.filterByState = function (newValue) {
            if (typeof (newValue) !== 'undefined') {
                if (newValue[0] !== null && newValue.length !== 0) {
                    $scope.disableDataTypeFilter = true;
                    $scope.disableGeographyFilter = true;
                    $scope.buildFilters('State', newValue);
                } else {
                    $scope.disableDataTypeFilter = false;
                    $scope.disableGeographyFilter = false;
                    $scope.buildFilters('none');
                }
            } else {
                $scope.disableGeographyFilter = false;
                $scope.buildFilters('none');
            }
        }
        $scope.$watch("slctCityCounty", function (newValue, oldValue) {
            $scope.filterByCityCounty(newValue);
        });

        $scope.filterByCityCounty = function (newValue) {
            if (typeof (newValue) !== 'undefined') {
                if ((newValue[0] !== null && newValue.length !== 0)) {
                    $scope.disableDataTypeFilter = true;
                    $scope.disableGeographyFilter = true;
                    $scope.disableStateFilter = true;
                    $scope.buildFilters('CityCounty', newValue);
                } else {
                    $scope.disableDataTypeFilter = true;
                    $scope.disableGeographyFilter = true;
                    $scope.disableStateFilter = false;
                    $scope.filterByState($scope.slctState);
                }
            } else {
                $scope.disableDataTypeFilter = true;
                $scope.disableGeographyFilter = true;
                $scope.disableStateFilter = false;
                $scope.filterByState($scope.slctState);
            }
        };


        $scope.$watch("slctHuc6", function (newValue, oldValue) {
            $log.log('watchSlctHuc6');
            $log.log(oldValue);
            $log.log(newValue);
            $scope.filterByHuc6(newValue);
        });
        $scope.filterByHuc6 = function (newValue) {
            if (typeof (newValue) !== 'undefined') {
                if (newValue[0] !== null && newValue.length !== 0) {
                    $scope.disableDataTypeFilter = true;
                    $scope.disableGeographyFilter = true;
                    $scope.buildFilters('Huc6Name', newValue);
                } else {
                    $scope.disableDataTypeFilter = true;
                    $scope.disableGeographyFilter = false;
                    $scope.buildFilters('none');
                }
            } else {
                $scope.disableDataTypeFilter = true;
                $scope.disableGeographyFilter = false;
                $scope.buildFilters('none');
            }
        }
        $scope.$watch("slctHuc12", function (newValue, oldValue) {
            $scope.filterByHuc12(newValue);
        });
        $scope.filterByHuc12 = function (newValue) {
            if (typeof (newValue) !== 'undefined') {
                if ((newValue[0] !== null && newValue.length !== 0)) {
                    $scope.disableDataTypeFilter = true;
                    $scope.disableGeographyFilter = true;
                    $scope.disableHuc6Filter = true;
                    $scope.buildFilters('WaterBody', newValue);
                } else {
                    $scope.disableDataTypeFilter = true;
                    $scope.disableGeographyFilter = true;
                    $scope.disableHuc6Filter = false;
                    $scope.filterByHuc6($scope.slctHuc6);
                }
            } else {
                $scope.disableDataTypeFilter = true;
                $scope.disableGeographyFilter = true;
                $scope.disableHuc6Filter = false;
                $scope.filterByHuc6($scope.slctHuc6);
            }
        };
        $scope.$watch("slctGroupId", function (newValue, oldValue) {
            $scope.filterByGroupId(newValue);
        });
        $scope.filterByGroupId = function (newValue) {
            if (typeof (newValue) !== 'undefined') {
                if ((newValue[0] !== null && newValue.length !== 0)) {
                    $scope.disableDataTypeFilter = true;
                    $scope.disableGeographyFilter = true;
                    $scope.disableHuc6Filter = true;
                    $scope.disableHuc12Filter = true;
                    $scope.disableStateFilter = true;
                    $scope.disableCityCountyFilter = true;
                    $scope.buildFilters('Group', newValue);
                } else {
                    $scope.disableDataTypeFilter = true;
                    $scope.disableGeographyFilter = true;
                    $scope.disableHuc6Filter = true;
                    $scope.disableHuc12Filter = false;
                    $scope.disableStateFilter = true;
                    $scope.disableCityCountyFilter = false;
                    $scope.filterByHuc12($scope.slctHuc12);
                    $scope.filterByCityCounty($scope.slctCityCounty);
                }
            } else {
                $scope.disableDataTypeFilter = true;
                $scope.disableGeographyFilter = true;
                $scope.disableHuc6Filter = true;
                $scope.disableHuc12Filter = false;
                $scope.disableStateFilter = true;
                $scope.disableCityCountyFilter = false;
                $scope.filterByHuc12($scope.slctHuc12);
                $scope.filterByCityCounty($scope.slctCityCounty);
            }
        };
        $scope.$watch("slctStationId", function (newValue, oldValue) {
            $scope.filterByStationId(newValue);
        });
        $scope.filterByStationId = function (newValue) {
            if (typeof (newValue) !== 'undefined') {
                if ((newValue[0] !== null && newValue.length !== 0)) {
                    $scope.disableDataTypeFilter = true;
                    $scope.disableGeographyFilter = true;
                    $scope.disableHuc6Filter = true;
                    $scope.disableHuc12Filter = true;
                    $scope.disableStateFilter = true;
                    $scope.disableCityCountyFilter = true;
                    $scope.disableGroupFilter = true;
                    $scope.buildFilters('Station', newValue);
                } else {
                    $scope.disableDataTypeFilter = true;
                    $scope.disableGeographyFilter = true;
                    $scope.disableHuc6Filter = true;
                    $scope.disableHuc12Filter = true;
                    $scope.disableStateFilter = true;
                    $scope.disableCityCountyFilter = true;
                    $scope.disableGroupFilter = false;
                    $scope.filterByGroupId($scope.slctGroupId);
                }
            } else {
                $scope.disableDataTypeFilter = true;
                $scope.disableGeographyFilter = true;
                $scope.disableHuc6Filter = true;
                $scope.disableHuc12Filter = true;
                $scope.disableStateFilter = true;
                $scope.disableCityCountyFilter = true;
                $scope.disableGroupFilter = false;
                $scope.filterByGroupId($scope.slctGroupId);
            }
        };

        $scope.$watch("slctParameterId", function (newValue, oldValue) {
            $scope.filterByParameterId(newValue);
        });
        $scope.filterByParameterId = function (newValue) {
            if (typeof (newValue) !== 'undefined') {
                if ((newValue[0] !== null && newValue.length !== 0)) {
                    $scope.disableDataTypeFilter = true;
                    $scope.disableGeographyFilter = true;
                    $scope.disableHuc6Filter = true;
                    $scope.disableHuc12Filter = true;
                    $scope.disableStateFilter = true;
                    $scope.disableCityCountyFilter = true;
                    $scope.disableGroupFilter = true;
                    $scope.disableStationFilter = true;
                    $scope.buildFilters('Station', newValue);
                } else {
                    $scope.disableDataTypeFilter = true;
                    $scope.disableGeographyFilter = true;
                    $scope.disableHuc6Filter = true;
                    $scope.disableHuc12Filter = true;
                    $scope.disableStateFilter = true;
                    $scope.disableCityCountyFilter = true;
                    $scope.disableGroupFilter = true;
                    $scope.disableStationFilter = false;
                    $scope.filterByStationId($scope.slctStationId);
                }
            } else {
                $scope.disableDataTypeFilter = true;
                $scope.disableGeographyFilter = true;
                $scope.disableHuc6Filter = true;
                $scope.disableHuc12Filter = true;
                $scope.disableStateFilter = true;
                $scope.disableCityCountyFilter = true;
                $scope.disableGroupFilter = true;
                $scope.disableStationFilter = false;
                $scope.filterByStationId($scope.slctStationId);
            }
        };


      
        
        $scope.clearFilters = function () {
            $scope.slctCityCounty = [];
            $scope.slctState = [];
            $scope.slctHuc6 = [];
            $scope.slctHuc12 = [];
            $scope.slctStationId = [];
            $scope.slctGroupId = [];
            $scope.slctParameterId = [];
            $scope.disableDataTypeFilter = false;
            $scope.disableGeographyFilter = false;
            $scope.disableStateFilter = false;
            $scope.disableCityCountyFilter = false;
            $scope.disableHuc6Filter = false;
            $scope.disableHuc12Filter = false;
            $scope.disableGroupFilter = false;
            $scope.disableStationFilter = false;
            $scope.datesClear();
            $scope.buildFilters('none');
            $scope.metadata = {
                includeParameters: false,
                includeGroups: false,
                includeStations: false,
                includeCalibration: false
            };
            $timeout(function () {
                $('.selectpicker').selectpicker('refresh');
            }, 1);
        }

        $scope.parameterClear = function () {
            $scope.slctParameterId = [];
            $scope.disableStationFilter = false;
           
        }

        $scope.stationClear = function () {
            $scope.slctStationId = [];
            $scope.disableGroupFilter = false;
            
        }

        $scope.groupClear = function () {
            $scope.slctGroupId = [];
            $scope.disableHuc12Filter = false;
            $scope.disableCityCountyFilter = false;
        }

        $scope.huc6Clear = function () {
            $scope.slctHuc6 = [];
            $scope.disableGeographyFilter = false;
        }
        $scope.huc12Clear = function () {
            $scope.slctHuc12 = [];
            $scope.disableHuc6Filter = false;
        }

        $scope.stateClear = function () {
            $scope.slctState = [];
            $scope.disableGeographyFilter = false;
        }
        $scope.cityCountyClear = function () {
            $scope.slctCityCounty = [];
            $scope.disableStateFilter = false;
        }
        $scope.datesClear = function () {
            $scope.startDate = null; $scope.endDate = null;
        }

        $scope.hasValues = function (selection) {
            if (typeof (selection) !== 'undefined') {
                if (selection.length > 0 && selection[0] !== null) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        $scope.dateHasValue = function () {
            if (typeof ($scope.startDate) !== 'undefined' && typeof ($scope.startDate) !== 'undefined') {
                if ($scope.startDate !== null|$scope.endDate!== null) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        $scope.buildFilters = function (filterChanged, newValue) {
            if (typeof ($scope.stationGroups) !== 'undefined' && typeof ($scope.parameterGroups) !== 'undefined') {
                if (filterChanged == 'none') {
                    $scope.huc6List = [];
                    $scope.statesList = [];
                }
                if (filterChanged == 'State' | filterChanged == 'none') {
                    $scope.cityCountyList = [];
                }
               
                if (filterChanged == 'Huc6Name'|filterChanged=='none') {
                    $scope.huc12List = [];
                }
                if (filterChanged == 'Huc6Name' | filterChanged == 'WaterBody' | filterChanged =='none'| filterChanged == 'State' | filterChanged=='CityCounty') {
                    $scope.groupsList = [];
                }
                if (filterChanged == 'Huc6Name' | filterChanged == 'WaterBody' | filterChanged == 'Group' | filterChanged == 'none' | filterChanged == 'State' | filterChanged=='CityCounty') {
                    $scope.stationsList = [];
                   
                   
                }
                $scope.parameterList = [];
                var methods = [];
                var flagHuc6 = [], flagHuc12 = [], flagState = [], flagCityCounty = [], flagGroup = [], flagStation = [], flagParameter = [];
                var stations = [];

                if ($scope.dataType == 'benthic') {
                    stations = $scope.benthicStations;
                } else {
                    stations = $scope.stations;
                }
                var flagHuc6 = [], flagState = [];
                stations.forEach(function (v, k) {
                    var include = false, includeByHuc6 = false, includeByHuc12 = false, includeByState = false, includeByCityCounty = false, includeByGroup = false, includeByStation = false;
                    var gNames = v.GroupNames.split(', ');

                   
                    if (filterChanged == 'none') {
                        if (!flagHuc6[v.Huc6Name]) {
                            flagHuc6[v.Huc6Name] = true;
                            $scope.huc6List.push(
                                {
                                    value: v.Huc6Name,
                                    name: v.Huc6Name
                                }
                            );
                        }

                        if (!flagState[v.State]) {
                            flagState[v.State] = true;

                            $scope.statesList.push(
                                {
                                    value: v.State,
                                    name: v.State
                                }
                            );
                        }
                    }


                    if ($scope.slctState[0] !== null && $scope.slctState.length !== 0) {
                        if (typeof ($scope.slctState) !== 'undefined') {
                            includeByState = $scope.slctState.indexOf(v['State']) > -1;
                        }
                    } else {
                        includeByState= true;
                    }

                    if ($scope.slctCityCounty[0] !== null && $scope.slctCityCounty.length !== 0) {
                        if (typeof ($scope.slctCityCounty) !== 'undefined') {
                            includeByCityCounty = $scope.slctCityCounty.indexOf(v['CityCounty']) > -1;
                        }
                    } else {
                        includeByCityCounty = true;
                    }

                    if ($scope.slctHuc6[0] !== null && $scope.slctHuc6.length !== 0) {
                        if (typeof ($scope.slctHuc6) !== 'undefined') {
                            includeByHuc6 = $scope.slctHuc6.indexOf(v['Huc6Name']) > -1;
                        }
                    } else {
                        includeByHuc6 = true;
                    }

                    if ($scope.slctHuc12[0] !== null && $scope.slctHuc12.length !== 0) {
                        if (typeof ($scope.slctHuc12) !== 'undefined') {
                            includeByHuc12 = $scope.slctHuc12.indexOf(v['WaterBody']) > -1;
                        }
                    } else {
                        includeByHuc12 = true;
                    }

                    if ($scope.slctGroupId[0] !== null && $scope.slctGroupId.length !== 0) {
                        var slctGroupNames = [];
                        $scope.slctGroupId.forEach(function (v, k) {
                            $scope.groupsList.forEach(function (value, key) {
                                if (value.value == v) {
                                    slctGroupNames.push(value.name);
                                }
                            });
                        });
                        slctGroupNames.forEach(function (gn, gi) {
                            if (gNames.indexOf(gn) > -1) {
                                includeByGroup = true;
                            }
                        });
                    } else {
                        includeByGroup = true;
                    }

                    if ($scope.slctStationId[0] !== null && $scope.slctStationId.length !== 0) {
                        if (typeof ($scope.slctStationId) !== 'undefined') {
                            includeByStation = $scope.slctStationId.indexOf(v['StationId']) > -1;
                        }
                    } else {
                        includeByStation = true;
                    }

                    if (filterChanged === 'State') {
                        if (includeByState) {
                            include = true;
                        }
                    }

                    if (filterChanged === 'CityCounty') {
                        if (includeByState && includeByCityCounty) {
                            include = true;
                        }
                    }

                    if (filterChanged === 'Huc6Name') {
                        if (includeByHuc6) {
                            include = true;
                        }
                    }

                    if (filterChanged === 'WaterBody') {
                        if (includeByHuc6 && includeByHuc12) {
                            include = true;
                        }
                    }

                    if (filterChanged === 'Group') {
                        if (($scope.slctGeography == 'Watershed' && includeByHuc6 && includeByHuc12 && includeByGroup)) {
                            include = true;
                        } else if (($scope.slctGeography == 'Political' && includeByState && includeByCityCounty && includeByGroup)) {
                            include = true;
                        }
                    }

                    if (filterChanged === 'Station') {
                        if (($scope.slctGeography == 'Watershed' && includeByHuc6 && includeByHuc12 && includeByGroup && includeByStation) ) {
                            include = true;
                        } else if (($scope.slctGeography == 'Political' && includeByState && includeByCityCounty && includeByGroup && includeByStation)) {
                            include = true;
                        }
                    }

                    if (include | filterChanged == 'none') {
                        if (filterChanged == 'State' | filterChanged == 'none') {
                            if (!flagCityCounty[v.CityCounty]) {
                                flagCityCounty[v.CityCounty] = true;
                                $scope.cityCountyList.push(
                                    {
                                        value: v.CityCounty,
                                        name: v.CityCounty
                                    }
                                );
                            }
                        }

                        if (filterChanged == 'Huc6Name'|filterChanged == 'none') {
                            if (!flagHuc12[v.WaterBody]) {
                                flagHuc12[v.WaterBody] = true;
                                $scope.huc12List.push(
                                    {
                                        value: v.WaterBody,
                                        name: v.WaterBody
                                    }
                                );
                            }
                        }
                        gNames.forEach(function (value, key) {
                            if (filterChanged == 'Huc6Name' | filterChanged == 'WaterBody' | filterChanged == 'none' | filterChanged == 'State' | filterChanged == 'CityCounty') {
                                $scope.stationGroups.forEach(function (sg, i) {
                                    if (sg.Group.Name == value) {
                                        if (!flagGroup[value]) {
                                            flagGroup[value] = true;
                                            $scope.groupsList.push(
                                                {
                                                    value: sg.Group.Id,
                                                    name: sg.Group.Name
                                                }
                                            );
                                        }
                                    }
                                });
                            }

                            if ($scope.dataType == 'waterQuality') {
                                $scope.parameterGroups.forEach(function (pg, r) {
                                    if (pg.Group.Name == value) {
                                        if (!flagParameter[pg.Parameter.Name]) {
                                            flagParameter[pg.Parameter.Name] = true;
                                            $scope.parameterList.push(
                                                {
                                                    value: pg.Parameter.Name,
                                                    name: pg.Parameter.Name
                                                }
                                            );
                                        }
                                    }
                                })
                            } else {
                                $scope.groups.forEach(function (g, key) {
                                    if (g.Name == value) {
                                        if(methods.indexOf(g.BenthicMethod)<0){
                                            methods.push(g.BenthicMethod);
                                        }
                                    }
                                });
                                angular.forEach($scope.benthicParameters, function (bp, k) {
                                   
                                    if (methods.indexOf(bp.Method) > -1 | bp.Method == 'both') {
                                        if (!flagParameter[bp.Name]) {
                                            flagParameter[bp.Name] = true;
                                            
                                            $scope.parameterList.push({
                                                value: bp.Name,
                                                name: bp.Name
                                            });
                                        } 

                                    }
                                });
                            }
                        });
                        if (filterChanged == 'Huc6Name' | filterChanged == 'WaterBody' | filterChanged == 'Group' | filterChanged == 'none'|filterChanged == 'State' | filterChanged=='CityCounty') {
                            if (!flagStation[v.Name]) {
                                flagStation[v.Name] = true;
                                $scope.stationsList.push(
                                    {
                                        value: v.StationId,
                                        name: v.Name
                                    }
                                );
                            }
                           
                        }
                    }
                });
            }
            if (typeof ($scope.stationsList) !== 'undefined') {
                $scope.stationsList.sort(dynamicSort("name"));
            }
            if (typeof ($scope.parameterList) !== 'undefined') {
                $scope.parameterList.sort(dynamicSort("name"));
            }
            if (typeof ($scope.statesList) !== 'undefined') {
                $scope.statesList.sort(dynamicSort("name"));
            }
            if (typeof ($scope.cityCountyList) !== 'undefined') {
                $scope.cityCountyList.sort(dynamicSort("name"));
            }
            if (typeof ($scope.huc6List) !== 'undefined') {
                $scope.huc6List.sort(dynamicSort("name"));
            }
            if (typeof ($scope.huc12List) !== 'undefined') {
                $scope.huc12List.sort(dynamicSort("name"));
            }
            if (typeof ($scope.groupsList) !== 'undefined') {
                $scope.groupsList.sort(dynamicSort("name"));
            }
            $timeout(function () {
                $('.selectpicker').selectpicker('refresh');
                $scope.loading = false;
            }, 1);
        }
    }
    
    queryController.$inject = ['$scope', 'stationService', 'leafletMapEvents', 'leafletData', '$q','$log', '$http',
        '$filter', 'groupService', 'parameterService', 'benthicParameterService','stationGroupService', 'parameterGroupService','relatedParameterService','$timeout', 'FileSaver',
        'Blob', '$state', '$stateParams','$location','$rootScope'];
    app.controller("queryController", queryController);
}(angular.module("cmcPublic")));