(function (app) {
    var stationsController = function ($scope, $log, $http,problemService,stationGroupService,
                                        groupService, notificationFactory, stationService,
                                        stationSamplingMethodService,$q, $filter,
                                        userRole,userGroupId,userId,
                                        oData,leafletMapEvents,leafletData,$timeout) {
        //this function leverages angular.equals to do comparisons in array similar to jquery function $.inArray; however, it ,
        //this function leverages angular.equals to do comparisons in array similar to jquery function $.inArray; however, it 
        //ignores some relics added by angular, such as $$hashtag - from use of ng-repeat in html. 
        
        $scope.initialize = function () {
            $scope.deactivating = false;
            $scope.loading = true;
            $scope.outOfBounds = false;
            $scope.disableSave = false;
            var activeElement = angular.element(document.querySelector('.active'));
            activeElement.removeClass('active');
            var menuManageElement = angular.element(document.querySelector('#menuManage'));
            menuManageElement.addClass('active');
            notificationFactory.success('Stations are loading...', 'Loading', { timeOut: 0, extendedTimeOut: 0 });
            $scope.stationsLoaded = false;
            $scope.getStations();
            $scope.getGroups();
            $scope.getGroupStations(userGroupId);
            $scope.stnGroups = [];
            $scope.currentGroups = [];
            $scope.groupsList = [];
            $scope.getSamplingMethods();
            if (userRole == 'Monitor' || userRole == 'Coordinator') {
                $scope.isMonitorOrCoordinator = true;
               
            } else {
                $scope.isMonitorOrCoordinator = false;
            }
            $scope.userGroupId = userGroupId;
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
        
        $scope.getGroups = function () {
            (new groupService()).$getAll()
                .then(function (data) {
                    $scope.groups = data.value;
                    angular.forEach($scope.groups, function (value, key) {
                        $scope.groupsList.push(
                            {
                                value: value.Id,
                                name: value.Name
                            }
                         );
                    });
                    
                    //$scope.newStation.GroupId = $scope.groupsList[0].value;
                });
        };

        $scope.getGroupStations = function (grpId) {
            (new stationGroupService()).$getByGroupId({ key: grpId })
               .then(function (data) {
                   $scope.groupStations = data.value;
                   $scope.stationsInGroup = [];
                   angular.forEach($scope.groupStations, function (value, key) {
                       $scope.stationsInGroup.push(value.StationId);
                   })
               });
        }
        $scope.openAddStationModal = function () {
            console.log('modal open');
            $scope.showModal = true;
            leafletData.getMap('newStnMap').then(function (map) {
                $timeout(function () {
                    map.invalidateSize();
                    $('.selectpicker').selectpicker('refresh');
                
                }, 300);
            });
        };
        $scope.populateDropdowns = function () {
            $scope.tidalList = tidal;

        };
        $scope.populateDropdowns();

        $scope.stnMarkers = {};
        $scope.marker = {
            stnName:'',
            lat:'',
            lng:''
        }

        
        
        angular.extend($scope, {
            center: {
                lat: 38.50,
                lng: -76.61,
                zoom: 7
            },

            layers: {
                baselayers: {
                    osm: {
                        name: "OpenStreetMap",
                        type: "xyz",
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        layerOptions: {
                            subdomains: ["a", "b", "c"],
                            attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                            continuousWorld : true
                        }
                    },
                    aerial: {
                        name: "Aerial",
                        type: "xyz",
                        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                        layerOptions: {
                            attribution: '&copy; <a href="http://www.esri.com/">Esri</a>',
                                    continuousWorld: true
                        }
                    }
                }
            },           
        
            markers: {}
        });
        
        $scope.currentStation = {};
        $scope.newStation = {};

        $scope.toggle = true;
        $scope.selectStations = [];
        $scope.sort = function (keyname) {
            $scope.sortKey = ['!!' + keyname, keyname]; //need to add the !! to move empty fields to start of sort  
            $scope.sortKeyName = keyname; //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }
        $scope.sortStation = function (keyname) {
            $scope.stationSortKey = ['!!' + keyname, keyname]; //need to add the !! to move empty fields to start of sort  
            $scope.stationSortKeyName = keyname; //set the sortKey to the param passed
            $scope.stationReverse = !$scope.stationReverse; //if true make it false and vice versa
        }
        
        $scope.$on('leafletDirectiveMarker.click', function(event, args){
            // Check args param has leafletEvent, this is leaflet click event that
            // contains latitude and logitude from click
            $scope.search = args.leafletObject.options.stnName;

        });
                
        $scope.getStations = function () {
            
            $scope.selectedStations = [];
            (new stationService()).$getAll()
                .then(function (data) {
                    $scope.headers = [];
                    angular.forEach(data.value[0], function (value, index) {
                        $scope.headers.push(index);
                    })
                    $scope.stations = data.value;
                    $scope.stnMarkers = {};

                    
                    
                    
                    
                    $scope.populateStationList().then(function () {
                        angular.extend($scope, {
                            markers: $scope.stnMarkers
                        });
                        console.log($scope.stnMarkers);
                        $scope.stationsLoaded = true;
                        leafletData.getMap("insetMap").then(function (map) {
                            $timeout(function () {
                                map.invalidateSize();
                                
                            }, 300);
                        });

                        $scope.reverse = true;
                        $scope.sort('Name');

                        notificationFactory.success('Stations Loaded.', 'Stations Loaded');
                    });
                    

                });
        };
        // Set active station for patch update
        $scope.setStation = function (station) {
            $scope.currentStation = station;
            $scope.currentGroups = [];
            var crntGrps = [];
            //$('.selectpicker.multi').selectpicker('refresh');
            (new stationGroupService()).$getByStationId({ key: $scope.currentStation.Id })
                .then(function (data) {
                    angular.forEach(data.value, function (value, key) {
                        crntGrps.push(value.GroupId );
                    });
                    console.log('testcurrentGroups')
                    console.log(crntGrps);

                    $scope.currentGroups = crntGrps;
                    
                    //$('.selectpicker').selectpicker('refresh');
                    //$('.selectpicker').selectpicker('val', $scope.currentGroups);
                    //$('.selectpicker.multi').selectpicker('refresh');
                    

                });
            //$('.selectpicker.multi').selectpicker('refresh');
        };

        $scope.populateStationList = function () {
            var deferred = $q.defer();
            angular.forEach($scope.stations, function (value, index) {
                $scope.marker.lat = value.Lat;
                $scope.marker.lng = value.Long;
                $scope.marker.stnName = value.Name;

                $scope.stnMarkers[index] = angular.copy($scope.marker);
                (new stationGroupService()).$expandAllByStationId({ key: value.Id })
                .then(function (data) {
                    value.GroupNames = '';

                    angular.forEach(data.value, function (v, k) {
                        if(value.GroupNames === ''){
                            value.GroupNames = v.Group.Name;
                        } else {
                            value.GroupNames = value.GroupNames + '; ' + v.Group.Name;
                        }
                    });
                    if (index == ($scope.stations.length - 1)) {
                        deferred.resolve();
                    }
                });
            });
            return deferred.promise;
        }

        $scope.bayProgramWS = function (lat, long) {
            var deferred = $q.defer();
            var bpUrl = 'https://gis.chesapeakebay.net/ags/rest/services/geotagging/nad83/MapServer/identify?geometry=' +
                long + '%2C' + lat + '&geometryType=esriGeometryPoint&sr=&layers=all&layerDefs=&time=&layerTimeOptions=&tolerance=0&mapExtent=-80.6%2C36.5%2C-76.1%2C42.5&imageDisplay=2000%2C2000%2C96&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&f=pjson';
            $http({
                method: 'GET',
                url: bpUrl,
            }).then(function successCallback(data) {
                deferred.resolve(data.data.results);
            }, function errorCallback(response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }
        $scope.updateStation = function (form) {
            if (form.$valid) {
                var currentStation = $scope.currentStation;
                //do not ping bay program web service for edit, only for station upload in case group's want to customize these
                //$scope.bayProgramWS(currentStation.Lat, currentStation.Long).then(function (data) {
                //    $log.log('response');
                //    $log.log(data);

                //    var huc12 = null;
                //    var waterBody = null;
                //    var fips = null;
                //    var tidal = false;
                //    if(data.length > 0){
                //        angular.forEach(data, function (v, k) {
                //            if (v.layerName == 'HUC12') {
                //                huc12 = v.attributes.HUC_12;
                //                waterBody = v.value;
                //            } else if (v.layerName == 'FIPS') {
                //                fips = v.value;
                //            } else if (v.layerName == 'Fall_line') {
                //                if (v.value == 'below') {
                //                    tidal = true;
                //                } else {
                //                    tidal = false;
                //                }
                //            }
                //        })
                //    }
                notificationFactory.success('Updating information for ' + currentStation.Name + '.', 'Update', { timeOut: 0, extendedTimeOut: 0 });
                var DateTimeNow = new Date().toJSON();
                var updateStation = {
                    "Name": currentStation.Name,
                    "Code": currentStation.Code,
                    "NameLong": currentStation.NameLong,
                    "Description": currentStation.Description,
                    "Lat": parseFloat(currentStation.Lat),
                    "Long": parseFloat(currentStation.Long),
                    "StationSamplingMethodId": currentStation.StationSamplingMethodId,
                    "Datum": 'NAD83',
                    "Huc12": currentStation.Huc12,
                    "Fips": currentStation.Fips,
                    "Tidal": currentStation.Tidal,
                    "WaterBody": currentStation.WaterBody,
                    "Comments": currentStation.Comments,
                    "ModifiedBy": userId,
                    "ModifiedDate": DateTimeNow
                }
                $log.log('updateStation');
                $log.log(updateStation);
                var stationId = currentStation.Id;

                return (new stationService(updateStation)).$patch({ key: stationId })
                    .then(function (data) {
                        $scope.stationsLoaded = false;
                        $('.selectpicker').selectpicker('refresh');


                        angular.forEach($scope.currentGroups, function (value, key) {
                            $scope.stnGroups.push({
                                GroupId: value, StationId: stationId,
                                CreatedBy: userId,
                                ModifiedBy: userId,
                                ModifiedDate: DateTimeNow,
                                CreatedDate: DateTimeNow
                            });
                        });

                        return (new stationGroupService()).$getByStationId({ key: stationId })
                            .then(function (data) {
                                var stnGroups = data.value;

                                if (stnGroups.length > 0) {
                                    var deleteLoopPromises = [];
                                    angular.forEach(stnGroups, function (value, key) {
                                        var deferredDeleteLoop = $q.defer();
                                        deleteLoopPromises.push(deferredDeleteLoop.promise);
                                        var stnGroupToPatch = $filter('filter')($scope.stnGroups, {
                                            StationId: value.StationId,
                                            GroupId: value.GroupId
                                        });

                                        if (stnGroupToPatch.length == 0) {
                                            return (new stationGroupService()).$remove({ key: value.Id }).then(function () { deferredDeleteLoop.resolve() });
                                        } else {
                                            deferredDeleteLoop.resolve()
                                        }
                                        //
                                        //$log.log('delete one');
                                        //$log.log(value.Id + ';' + value.StationId + ';' + value.GroupId);
                                        //return (new stationGroupService()).$remove({ key: value.Id }).then(deferredDeleteLoop.resolve());
                                    });
                                    $q.all(deleteLoopPromises).then(function () {
                                        $scope.editSave();
                                    });
                                } else {
                                    $scope.editSave();
                                }



                            });



                    });
                    
                //});
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

        $scope.editSave = function () {
            var saveLoopPromises = [];
            angular.forEach($scope.stnGroups, function (value, key) {
                var deferred = $q.defer();
                saveLoopPromises.push(deferred.promise);

                return (new stationGroupService()).$getByStationIdAndGroupId({ stationId: value.StationId, groupId: value.GroupId })
                    .then(function (data) {
                        
                        if (data.value.length > 0) {
                            return (new stationGroupService(value)).$patch({key: data.value[0].Id}).then(function () { deferred.resolve() });
                        } else {
                            return (new stationGroupService(value)).$save().then(function () { deferred.resolve() });
                        }
                    });
                
            });
            $q.all(saveLoopPromises).then(function () {
                $scope.afterEdit();
            });
        }

        $scope.afterEdit = function () {
            
            $scope.getStations();
            $scope.stnGroups = [];
            $scope.currentGroups = [];
           
            angular.element('#editStationModal').modal('hide');
        }

        $scope.deleteStation = function (station) {
            var currentStation = station;
            notificationFactory.success(currentStation.Name + ' is being deleted...', 'Deleting Station', { timeOut: 0, extendedTimeOut: 0 })
            return (new stationService()).$remove({ key: currentStation.Id })
            .then(function (data) {
                notificationFactory.success(currentStation.Name + ' is deleted.', 'Station Deleted');
                $scope.getStations();
            });
        }

        $scope.getButtonText = function getButtonText(stn) {
            var btnText = '';
            if (stn.Status == true) {
                btnText = "De-Activate Station";
            } else  {
                btnText = "Activate Station";
            } 

            return btnText;
        }



        $scope.getButtonStatus = function getButtonStatus(stn) {
            var btnStatus = '';


            if (stn.Status == true) {
                btnStatus = "btn-danger";
            } else {
                btnStatus = "btn-success";
            } 

            return btnStatus;
        }

        $scope.openActivateModal = function (stn) {
            $log.log('test open acativate')
            $scope.activationStation = stn;           
            
            if (stn.Status == 0) {
                $('#activateStationModal').modal('show');
            } else {
                $('#deactivateStationModal').modal('show');
            }
             
        }

        $scope.activateConfirmation = function (stn) {
            var patchData = {
                'Code': stn.Code,
                'Status':true
            };

            patchData['Status'] = true;
            // $scope.deactivating = true;
            return (new stationService(patchData)).$patch({ key: stn.Id })
            .then(function (data) {
                $('#activateStationModal').modal('hide');
                $scope.deactivating = false;
                stn.Status = true;
            });
        }

        $scope.deactivateConfirmation = function (stn) {
            var patchData = {
                'Code': stn.Code,
                'Status': false
            };
            
           // $scope.deactivating = true;
            return (new stationService(patchData)).$patch({ key: stn.Id })
            .then(function (data) {
                $('#deactivateStationModal').modal('hide');
                $scope.deactivating = false;
                stn.Status = false;
            });
        }
        
    };
    stationsController.$inject = ['$scope', '$log','$http', 'problemService', 'stationGroupService',
                                        'groupService', 'notificationFactory', 'stationService',
                                        'stationSamplingMethodService', '$q', '$filter',
                                        'userRole', 'userGroupId', 'userId',
                                        'oData', 'leafletMapEvents', 'leafletData', '$timeout'];
    app.controller("stationsController", stationsController);
}(angular.module("cmcApp")));