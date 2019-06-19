(function (app) {
    var stationsSubmitController = function ($scope, $log, $q, $http,groupService, stationGroupService,
                                                notificationFactory, stationService, oData,
                                                userId, userName, userGroup, userGroupId,
                                                leafletMapEvents, leafletData, $timeout) {

        $scope.initialize = function () {
            $scope.loading = true;
            $scope.outOfBounds = false;
            $scope.disableSave = false;
            $scope.markers2 = [];           
            $scope.userGroup = userGroup;
            $scope.userName = userName;
            $scope.showMap = false;
            $scope.newStation = {};
            $scope.populateDropdowns();
            return (new groupService().$getById({ key: userGroupId })).then(function (data) {
                $log.log('groups')
                $log.log(data);
                $scope.groupCode = data.Code;
                $scope.newStation.Code = data.Code + '.';
                $scope.loading = false;
            });
        }
        $scope.$watch("newStation.Name", function (newValue, oldValue) {
            if (typeof newValue !== 'undefined') {
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

        $scope.$watch("showMap", function (value) {
            if (value === true) {
                leafletData.getMap().then(function (map) {
                    $timeout(function () {
                        map.invalidateSize();
                    }, 300);
                });
            }
        });
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
            markers2: $scope.markers2
        });
        
        $scope.populateDropdowns = function () {
            $scope.tidalList = tidal;
            $scope.newStation.Tidal = $scope.tidalList[0].value;            
            
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

        $scope.bayProgramWS = function (lat, long) {
            var deferred = $q.defer();
            var bpUrl = 'https://gis.chesapeakebay.net/ags/rest/services/geotagging/nad83/MapServer/identify?geometry=' +
                long + '%2C' + lat + '&geometryType=esriGeometryPoint&sr=&layers=all&layerDefs=&time=&layerTimeOptions=&tolerance=0&mapExtent=-80.6%2C36.5%2C-76.1%2C42.5&imageDisplay=2000%2C2000%2C96&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&f=pjson';
            $http({
                method: 'GET',
                url: bpUrl,
            }).then(function successCallback(data) {
                $log.log('dataBack');
                $log.log(data.data.results);
                deferred.resolve(data.data.results);
            }, function errorCallback(response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }
        $scope.addStation = function (form) {
            if (form.$valid) {
                $scope.disableSave = true;
                var newStation = $scope.newStation;
                var DateTimeNow = new Date().toJSON();
                $scope.bayProgramWS(newStation.Lat, newStation.Long).then(function (data) {
                    var huc12 = '';
                    var waterBody = '';
                    var fips = '';
                    var tidal = false;
                    var state = '';
                    var cityCounty = '';
                    var huc6Name = '';
                    $log.log('data');
                    $log.log(data);
                    
                    if (data.length > 0) {
                        angular.forEach(data, function (v, k) {
                            if (v.layerName == 'HUC12') {
                                huc12 = v.attributes.HUC_12;
                                huc6Name = v.attributes.HUC6Name;
                                waterBody = v.attributes.HU_12_NAME;
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
                        });
                       
                        notificationFactory.success(newStation.Name + ' is being added...', 'Adding Station', { timeOut: 0, extendedTimeOut: 0 })
                        return (new stationService({
                            "Name": newStation.Name,
                            "Code": newStation.Code,
                            "NameLong": newStation.NameLong,
                            "Description": newStation.Description,
                            "Lat": parseFloat(newStation.Lat),
                            "Long": parseFloat(newStation.Long),
                            "Datum": 'NAD83',
                            "Huc12": huc12,
                            "Huc6Name": huc6Name,
                            "State": state,
                            "CityCounty": cityCounty,
                            "Fips": fips,
                            "Tidal": tidal,
                            "WaterBody": waterBody,
                            "Status": false,
                            "Comments": newStation.Comments,
                            "CreatedBy": userId,
                            "ModifiedBy": userId,
                            "ModifiedDate": DateTimeNow,
                            "CreatedDate": DateTimeNow
                        })).$save()
                        .then(function (data) {
                            console.log('testingGroups');
                            console.log($scope.groups);
                            console.log('testingData');
                            console.log(data);
                            var stnGroup = {
                                'GroupId': userGroupId,
                                'StationId': data.Id,
                                'CreatedBy': userId,
                                'ModifiedBy': userId,
                                'ModifiedDate': DateTimeNow,
                                'CreatedDate': DateTimeNow
                            };
                            (new stationGroupService(stnGroup)).$save().then(function (data) {;
                                notificationFactory.success(newStation.Name + ' added successfully', 'Station Added!');
                                $scope.outOfBounds = false;
                                $scope.newStation = {};
                                $scope.newStation.Tidal = $scope.tidalList[0].value;
                                form.$setPristine();
                                form.$setUntouched();
                                angular.extend($scope, {
                                    markers2: {}
                                });
                            });

                        });
                    } else {
                        $scope.outOfBounds = true;
                        notificationFactory.error('Please check latitude and longitude on form errors', 'Problem with Spatial Analytics');
                        console.log(form);
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
                    console.log(form);
                    angular.forEach(form.$error, function (field) {
                        angular.forEach(field, function (errorField) {
                            errorField.$setTouched();
                            errorField.$setDirty();
                        })
                    });
                    $scope.disableSave = false;
            }
            
        }

        $scope.clearNewStation = function () {
            $scope.newStation = {};
        }



    };
    stationsSubmitController.$inject = ['$scope', '$log', '$q','$http','groupService', 'stationGroupService',
                                                'notificationFactory', 'stationService', 'oData',
                                                'userId', 'userName', 'userGroup', 'userGroupId',
                                                'leafletMapEvents', 'leafletData', '$timeout'];
    app.controller("stationsSubmitController", stationsSubmitController);
}(angular.module("cmcApp")));

