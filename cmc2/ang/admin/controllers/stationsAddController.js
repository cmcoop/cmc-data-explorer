(function (app) {
    var stationsAddController = function ($scope, $log, $http, $q,groupService, notificationFactory,
                                            stationService, stationGroupService,stationSamplingMethodService,
                                            userGroupId, userRole, userId,
                                            oData, leafletMapEvents, leafletData, $timeout) {

        let markers2 = [];
        angular.extend($scope, {            
            center: {
                lat: 38.50,
                lng: -76.61,
                zoom: 7
            },
            layers: {
                baselayers: {
                    openStreetMap: {
                        name: 'OpenStreetMap',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    }
                }
            },
            markers2: markers2
        });

        
        $scope.showMap = false;
        $scope.userGroupId = userGroupId;
        $scope.userId = userId;
        $scope.groups = [];
        
        

        if (userRole == 'Monitor' || userRole == 'Coordinator') {
            $scope.isMonitorOrCoordinator = true;
            $scope.groups.push(userGroupId);
        } else {
            $scope.isMonitorOrCoordinator = false;
        }

       


        $scope.$watch("showMap", function (value) {
            if (value === true) {
                leafletData.getMap("newStnMap").then(function (map) {
                    $timeout(function () {
                        map.invalidateSize();
                        $timeout(function () {
                            map.invalidateSize();
                        }, 1);
                    }, 300);
                });
            }
        });
        

        $scope.populateDropdowns = function () {
            $scope.tidalList = tidal;
            $scope.newStation.Tidal = $scope.tidalList[0].value;
            $scope.getSamplingMethods();
            
        };
        

        $scope.getSamplingMethods = function () {
            $scope.samplingMethodsList = [{
                "name": "",
                "value": null
            }];
            return (new stationSamplingMethodService()).$getAll().then(function (data) {
                angular.forEach(data.value, function (value, index) {
                    $scope.samplingMethodsList.push({
                        "name": value.Name,
                        "value": value.Id
                    })
                });
                $scope.newStation.StationSamplingMethodId = $scope.samplingMethodsList[0].value;
            });
        }

        $scope.populateDropdowns();

        $scope.$watch('groups', function (newValue, oldValue) {
            if (newValue > 0) {
                return (new groupService().$getById({ key: newValue })).then(function (data) {
                    $scope.groupCode = data.Code;
                    $scope.newStation.Code = data.Code + '.';
                    $scope.newStation.Name = null;
                });
            }
        })

        
        $scope.$watch("newStation.Name", function (newValue, oldValue) {
            if (typeof newValue !== 'undefined' && newValue !== null) {
                $scope.newStation.Code = $scope.groupCode + '.' + newValue.replace(/\s/g, '');
                (new stationService()).$getByStationCode({ key: $scope.newStation.Code })
                .then(function (data) {
                    if (data.value.length > 0) {
                        (new stationService()).$getByStationCodeStartsWith({ key: ($scope.newStation.Code + '.') })
                        .then(function (data) {
                            if (data.value.length > 0) {
                                var maxCode = data.value[0].Code;
                                var newInt = parseInt(maxCode[maxCode.length - 1]) + 1;
                                $scope.newStation.Code = $scope.newStation.Code + '.' + newInt.toString();
                            } else {
                                $scope.newStation.Code = $scope.newStation.Code + '.1';
                            }
                        });
                    }
                });
            }
        });

        //$scope.$watch("newStation.Lat", function (newValue, oldValue) {
        //    if (typeof newValue !== 'undefined' && newValue !== null && $scope.newStation.Long !== 'undefined' && $scope.newStation.Long !== null) {
        //        $scope.addMarkers2($scope.newStation.Lat, $scope.newStation.Long)
        //    }
        //});
        //$scope.$watch("newStation.Long", function (newValue, oldValue) {
        //    if (typeof newValue !== 'undefined' && newValue !== null && $scope.newStation.Lat !== 'undefined' && $scope.newStation.Lat !== null) {
        //        $scope.addMarkers2($scope.newStation.Lat, $scope.newStation.Long)
        //    }
        //});

        $scope.stnGroups = [];
       
        $scope.addMarkers = function (lat, long) {
            angular.extend($scope, {
                markers: {
                    m1: {
                        lat: lat,
                        lng: long
                    }
                }
            });
        };
        $scope.addMarkers2 = function (lat, long) {
            angular.extend($scope, {
                markers2: {
                    m1: {
                        lat: lat,
                        lng: long
                    }
                }
            });
        };
        $scope.$on('leafletDirectiveMap.newStnMap.click', function (event, args) {           
            var lat = args.leafletEvent.latlng.lat;
            var long = args.leafletEvent.latlng.lng;
            $scope.newStation.Lat = parseFloat(lat.toFixed(5));
            $scope.newStation.Long = parseFloat(long.toFixed(5));
            $scope.addMarkers2(lat, long);
        });

        

        $scope.addStation = function (form) {
            if (form.$valid) {
                $scope.disableSave = true;
                var newStation = $scope.newStation;
                var DateTimeNow = new Date().toJSON();
                //get spatial associated info from bay program web service                
                $scope.bayProgramWS(newStation.Lat, newStation.Long).then(function (data) {                    
                    var huc12 = '';
                    var waterBody = '';
                    var fips = '';
                    var tidal = false;
                    var state = '';
                    var cityCounty = '';
                    var huc6Name = '';
                    if (data.length > 0) {
                        angular.forEach(data, function (v, k) {
                            if (v.layerName == 'HUC12') {
                                huc12 = v.attributes.HUC_12;
                                waterBody = v.attributes.HU_12_NAME;
                                huc6Name = v.attributes.HUC6Name;
                            } else if (v.layerName == 'FIPS') {
                                fips = v.value;
                                state = v.attributes.StName;
                                cityCounty = v.attributes.CoNameFull;                                
                            } else if (v.layerName == 'Fall_line') {
                                if (v.value == 'below') {
                                    tidal = true;
                                } else {
                                    tidal = false;
                                }
                            }
                        })
                        
                        notificationFactory.success(newStation.Name + ' is being added...', 'Adding Station', { timeOut: 0, extendedTimeOut: 0 })
                        return (new stationService({
                            "Name": newStation.Name,
                            "Code": newStation.Code,
                            "NameLong": newStation.NameLong,
                            "Description": newStation.Description,
                            "Lat": parseFloat(newStation.Lat),
                            "Long": parseFloat(newStation.Long),
                            "StationSamplingMethodId": newStation.StationSamplingMethodId,
                            "Huc12": huc12,
                            "Huc6Name": huc6Name,
                            "State": state,
                            "CityCounty": cityCounty,
                            "Fips": fips,
                            "Tidal": tidal,
                            "WaterBody": waterBody,
                            "Datum": 'NAD83',
                            "Status": true,
                            "Comments": newStation.Comments,
                            "CreatedBy": userId,
                            "ModifiedBy": userId,
                            "ModifiedDate": DateTimeNow,
                            "CreatedDate": DateTimeNow
                        })).$save()
                        .then(function (data) {
                            if ($scope.isMonitorOrCoordinator) {
                                $scope.stnGroups.push({
                                    GroupId: userGroupId,
                                    StationId: data.Id,
                                    CreatedBy: userId,
                                    ModifiedBy: userId,
                                    ModifiedDate: DateTimeNow,
                                    CreatedDate: DateTimeNow
                                });
                            } else {
                                $scope.stnGroups.push({
                                    GroupId: $scope.groups,
                                    StationId: data.Id,
                                    CreatedBy: userId,
                                    ModifiedBy: userId,
                                    ModifiedDate: DateTimeNow,
                                    CreatedDate: DateTimeNow
                                });
                            }
                            angular.forEach($scope.stnGroups, function (value, key) {
                                return (new stationGroupService(value)).$save();
                            });

                            notificationFactory.success(newStation.Name + ' added successfully', 'Station Added!');
                            $scope.outOfBounds = false;
                            $scope.newStation = {};
                            $scope.newStation.Tidal = $scope.tidalList[0].value;
                            $scope.getStations();
                            $scope.stationsInGroup.push(data.Id);
                            $scope.groups = [];
                            $scope.stnGroups = [];
                            $scope.clearFormValidation(form);
                            angular.element('#addStationModal').modal('hide');
                        
                        });
                    } else {
                        $scope.outOfBounds = true;
                        notificationFactory.error('Please check latitude and longitude on form for errors', 'Problem with Spatial Analytics');
                        
                        angular.forEach(form.$error, function (field) {
                            angular.forEach(field, function (errorField) {
                                errorField.$setTouched();
                                errorField.$setDirty();
                            })
                        });
                        $scope.disableSave = false;
                    }
                });
            } else {
                notificationFactory.error('Please check form for errors', 'Something went wrong');
                
                angular.forEach(form.$error, function (field) {
                    angular.forEach(field, function (errorField) {
                        errorField.$setTouched();
                    })
                });
                $scope.disableSave = false;
            }
            
        }

       

        $scope.clearNewStation = function (form) {            
            $scope.newStation = {};
            $scope.newStation.Tidal = $scope.tidalList[0].value;
            $scope.newStation.Code = null;
            $scope.groupCode = null;
            if (!$scope.isMonitorOrCoordinator) {
                $scope.groups = [];
            }
            
            
            $scope.clearFormValidation(form);
            //$scope.newStation.GroupId = $scope.[0].value;
        }
        $scope.clearFormValidation = function (form) {
            form.$setUntouched();
        }
       
        
    };
    stationsAddController.$inject = ['$scope', '$log', '$http', '$q','groupService', 'notificationFactory',
                                            'stationService', 'stationGroupService', 'stationSamplingMethodService',
                                            'userGroupId', 'userRole', 'userId',
                                            'oData', 'leafletMapEvents', 'leafletData', '$timeout'];
    app.controller("stationsAddController", stationsAddController);
}(angular.module("cmcApp")));