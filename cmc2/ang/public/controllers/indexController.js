(function (app) {
    var indexController = function ($scope, stationService, leafletMapEvents, leafletData, $log, $http) {
        $scope.getStations = function () {
            //notificationFactory.success('Stations are loading...', 'Loading', { timeOut: 0, extendedTimeOut: 0 });
            $scope.selectedStations = [];
            (new stationService()).$getAll()
                .then(function (data) {
                    $scope.stations = data.value;
                    console.log($scope.stations);
                    $scope.stnMarkers = {};
                    angular.forEach($scope.stations, function (value, index) {
                        $scope.marker.lat = value.Lat;
                        $scope.marker.lng = value.Long;
                        $scope.marker.stnNameLong = value.NameLong;
                        $scope.marker.stnName = value.Name;
                        $scope.marker.message = '<h5>' + value.Name + ' (' + value.Name + ')</h4>';
                        //$scope.marker.icon = {
                        //    iconUrl: '../../../Images/mapIcons/pink-circle-th.png',
                        //    iconSize: [5, 5]
                        //}
                        $scope.stnMarkers[index] = angular.copy($scope.marker);
                    });
                    angular.extend($scope, {
                        markers: $scope.stnMarkers
                    });
                    console.log($scope.stnMarkers);                   

                });

        };

        $scope.getWatershed = function () {
            $http({ method: 'GET', url: '../../../SpatialData/chesbay.json' }).success(function (data, status, headers, config) {
                $log.log('watershed')
                $log.log(data);
                //$scope.watershed = data;
                //L.geoJSON(geojsonFeature).addTo(map);

                angular.extend($scope.layers.overlays, {
                    countries: {
                        name: 'World Country Boundaries',
                        type: 'geoJSONShape',
                        data: data,
                        visible: true,
                        layerOptions: {
                            style: {
                                color: '#003333',
                                fillColor: '#006666',
                                weight: 2.0,
                                opacity: 0.6,
                                fillOpacity: 0.2
                            }
                        }
                    }
                });
            });
        }

       
        $scope.initialize = function () {
            $scope.stnMarkers = {};
            $scope.marker = {
                stnName: '',
                lat: '',
                lng: '',
                message: ''

            }
            console.log('start');
            $scope.getStations();
            $scope.getWatershed();
        };
       
        angular.extend($scope, {
            center: {
                lat: 39.8,
                lng: -76.61,
                zoom: 6
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
                            continuousWorld: true
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
                },
                overlays: {}
            },

            markers: {}
        });
        $scope.$on('leafletDirectiveMarker.click', function (event, args) {
            // Check args param has leafletEvent, this is leaflet click event that
            // contains latitude and logitude from click
            
            $log.log(args.leafletObject.options.stnName);
            

        });
    };
    
    indexController.$inject = ['$scope', 'stationService', 'leafletMapEvents', 'leafletData', '$log', '$http'];
    app.controller("indexController", indexController);
}(angular.module("cmcPublic")));