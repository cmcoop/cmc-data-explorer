(function (app) {
    var homeController = function ($scope, stationService, leafletMapEvents, leafletData, $log, $http, $filter,$q,
        benthicSampleService, sampleService, $timeout, FileSaver, Blob, $state, $rootScope, $window) {
        $scope.$watch(function () {
            return $state.$current
        }, function (newVal, oldVal) {
            $scope.current = newVal;
            //do something with values
        })

        $scope.togglePanel = function () {
            if ($scope.showPanel) {
                $scope.showPanel = !$scope.showPanel
                $(".slideText,.slideIcon, .slidePanel").animate({
                    right: "-=290"
                }, 700, function () {
                    // Animation complete.
                });
            }
            else {
                $scope.showPanel = !$scope.showPanel
                $(".slideText,.slideIcon, .slidePanel").animate({
                    right: "+=290"
                }, 700, function () {
                    // Animation complete.
                });
                
            }
            

        }

        $scope.toggleLayersPanel = function () {
            if ($scope.showLayersPanel) {
                $scope.showLayersPanel = !$scope.showLayersPanel
                $(".slideLayersText,.slideLayersIcon, .slideLayersPanel").animate({
                    left: "-=194"
                }, 700, function () {
                    // Animation complete.
                });
            }
            else {
                $scope.showLayersPanel = !$scope.showLayersPanel
                $(".slideLayersText,.slideLayersIcon, .slideLayersPanel").animate({
                    left: "+=194"
                }, 700, function () {
                    // Animation complete.
                });
            }
        }
        $scope.stationsToMapMarkers = function (type) {
            //notificationFactory.success('Stations are loading...', 'Loading', { timeOut: 0, extendedTimeOut: 0 });
            //$scope.stationsLoading = true;
            var stationCounts = $scope.stationsCounts;
            if (type !== 'wq') {
                stationCounts = $scope.benthicStationsCounts;
            }
            if ($(window).width() < 600) {
                $timeout(function () {
                    $scope.toggleLayersPanel();
                }, 1200);
            };
            $scope.selectedStations = [];            
            $scope.showParamInfo = false;
            $scope.stnMarkers = {};
            $scope.stnMarkersInset = {};
            $scope.dataIsOne = false;
            angular.forEach($scope.stations, function (value, index) {                       
                
                var eventsCount = 0;
                angular.forEach(stationCounts, function (v, i) {

                    if (v.StationId == value.Id) {
                        var stnCount = v

                        var stnLat = value.Lat;
                        var stnLong = value.Long;
                        var stnDescription = value.Description;
                        var waterBody = value.WaterBody;
                        if (type == 'wq') {
                            $scope.marker.layer = 'wq';
                        } else {
                            $scope.marker.layer = 'benthic';
                        }

                        $scope.marker.opacity = 1.0;
                        $scope.marker.lat = value.Lat;
                        $scope.marker.lng = value.Long;
                        $scope.markerInset.lat = value.Lat;
                        $scope.markerInset.lng = value.Long;
                        $scope.markerInset.stationId = value.Id;
                        $scope.marker.stnNameLong = value.NameLong;
                        $scope.marker.Description = value.Description;
                        $scope.marker.stnName = value.Name;
                        eventsCount = stnCount.EventCount;

                        if (type == 'wq') {
                            var iUrl = '../../../Images/mapIcons/g1.png'
                            if (eventsCount > 10 & eventsCount < 51) {
                                iUrl = '../../../Images/mapIcons/g2.png'
                            } else if (eventsCount > 50 & eventsCount < 101) {
                                iUrl = '../../../Images/mapIcons/g3.png'
                            } else if (eventsCount > 100) {
                                iUrl = '../../../Images/mapIcons/g4.png'
                            }
                        } else {
                            var iUrl = '../../../Images/mapIcons/o1.png'
                            if (eventsCount > 10 & eventsCount < 51) {
                                iUrl = '../../../Images/mapIcons/o2.png'
                            } else if (eventsCount > 50 & eventsCount < 101) {
                                iUrl = '../../../Images/mapIcons/o3.png'
                            } else if (eventsCount > 100) {
                                iUrl = '../../../Images/mapIcons/o4.png'
                            }
                        }
                        $scope.marker.icon = {
                            iconUrl: iUrl,
                            iconSize: [15, 15]
                        }
                        $scope.markerInset.icon = {
                            iconUrl: iUrl,
                            iconSize: [10, 10]
                        }

                        $scope.markerInset.message = value.Name;

                        $scope.marker.getMessageScope = function () { return $scope; };
                        $scope.station = value;

                        var stnName = '';
                        var stnNameLong = '';
                        var stnGroupNames = '';


                        if (value.Name !== null && typeof (value.Name) !== 'undefined') {
                            stnName = value.Name;
                        }
                        if (value.NameLong !== null && typeof (value.NameLong) !== 'undefined') {
                            stnNameLong = value.NameLong;
                        }
                        if (stnCount.GroupNames !== null && typeof (stnCount.GroupNames) !== 'undefined') {
                            stnGroupNames = stnCount.GroupNames;
                            stnGroupNamesTest = stnGroupNames.replace(/'/g, "\\'");
                        }

                        var waterBodyLabel = '';
                        if (typeof (waterBody) !== 'undefined' && waterBody !== null) {
                            waterBodyLabel = '<div class="frontEndLabel">Water Body</div><div class="frontEndInfo">' + waterBody + '</div>';
                        }

                        var stnNameLongLabel = '';
                        if (stnNameLong.length > 0) {
                            stnNameLongLabel = ' - <i>' + stnNameLong + '</i>';
                        }

                        //$scope.marker.message= "<p>{{ test }}</p>";f
                        $scope.marker.message = '<div class="frontEndLabel">Station</div><div class="frontEndInfo">' + stnName + stnNameLongLabel + '</div>' + waterBodyLabel + '<div class="frontEndLabel">Monitored By</div><div class="frontEndInfo">' + stnGroupNamesTest + '</div><button class="btn btn-sm btn-success"' +
                            ' ng-click="markerClicked(\'' + value.Id + '\',\'' + stnNameLong + '\',\'' + stnName + '\',\'' + stnGroupNamesTest + '\',\'' + stnLat + '\',\'' + stnLong + '\',\'' + stnDescription + '\')">' +
                            '<i class="fa fa-line-chart"></i>' +
                            ' View Station Details</button>';
                        $scope.marker.compileMessage = true;


                        $scope.stnMarkers[index] = angular.copy($scope.marker);
                        $scope.stnMarkersInset[index] = angular.copy($scope.markerInset);
                    }
                });
                       
                        
            });
            angular.extend($scope, {
                markers: $scope.stnMarkers
            });
            
            $scope.exportPlot = function () {
                var elements = document.getElementsByClassName('nvd3-svg');
                var requiredElement = elements[0];
                saveSvgAsPng(requiredElement, "diagram.png");
            }

            var legend ={};
            if(type == 'wq'){
                legend = {
                    title: 'Total Sampling Events',
                    position: 'bottomleft',
                    colors: ['#42d9cb', '#03bdac', '#158579', '#436965'],
                    labels: ['< 10', '10 - 50', '51 - 100', '> 100']
                }
            }else{
                legend = {
                    title: 'Total Sampling Events',
                    position: 'bottomleft',
                    colors: ['#ffd277', '#ffad49', '#d57c31', '#7f6a45'],
                    labels: ['< 1', '1 - 5', '6 - 10', '> 10']
                }
            }
            angular.extend($scope,{legend:legend});

            angular.extend($scope, {
                markersInset: $scope.stnMarkersInset
            })

            $scope.stationsLoading = false;

        };
            
        $('#myModal').on('shown.bs.modal', function (e) {
            var promises = [
                $scope.getSamples($scope.stationId),
                $scope.getBenthicSamples($scope.stationId)
            ]
            $q.all(promises)
           .then(function (values) {
               if (typeof values[0] !== 'undefined') {
                   $scope.samples = values[0].value;
                   if ($scope.samples.length > 0) {
                       $scope.NoSamplesForStation = false;
                       $scope.getPlotParameters('wq');

                   } else {
                       $scope.NoSamplesForStation = true;
                   }
                   
                   $scope.loadInsetMap();
               }
               if (typeof values[1] !== 'undefined') {

                   $scope.benthicSamples = values[1].value;
                   if ($scope.benthicSamples.length > 0) {
                       $scope.NoBenthicSamplesForStation = false;
                       $scope.calculateMetrics($scope.benthicSamples);
                       if (values[0].value.length == 0) {                          
                           $scope.getPlotParameters('benthic');
                       }
                   } else {
                       $scope.NoBenthicSamplesForStation = true;
                       
                   }
               }
           });
        })


        $scope.markerClicked = function (id, nameLong, name, groupNames, lat, long, description) {
            //$(timeout)
            //$scope.slctParam = null;
            var promises = [
                 $scope.setUpModal(id, nameLong, name, groupNames, lat, long, description)
            ]
            $q.all(promises)
           .then(function (values) {
              

               angular.element('#myModal').modal('show');
               leafletData.getMap('mainMap').then(function (map) {
                   map.closePopup();
               });
           });
                      
        }
        $scope.setUpModal = function (id, nameLong, name, groupNames, lat, long, description) {
            $scope.plotLoading = true;
            $scope.showMap = false;
            $scope.isTier2 = false;
            $scope.stationId = id;
            $scope.stationName = name;
            $scope.stationNameLong = nameLong;
            $scope.stationGroupNames = groupNames;
            $scope.stationLat = lat;
            $scope.stationLong = long;
            $scope.stationDescription = description;



            $scope.centerInset.lat = parseFloat($scope.stationLat);
            $scope.centerInset.lng = parseFloat($scope.stationLong);

            angular.forEach($scope.markersInset, function (v, i) {
                if (v.stationId == id) {
                    var check = v.icon.iconUrl.substring(v.icon.iconUrl.length - 5, v.icon.iconUrl.length - 4);
                    if (check !== 'h') {
                        var url = v.icon.iconUrl.substring(0, v.icon.iconUrl.length - 4) + 'h.png';
                        v.icon.iconUrl = url;
                    }
                    v.icon.iconSize = [40, 40];
                } else {
                    var check = v.icon.iconUrl.substring(v.icon.iconUrl.length - 5, v.icon.iconUrl.length - 4);
                    if (check == 'h') {
                        v.icon.iconUrl = v.icon.iconUrl.substring(0, v.icon.iconUrl.length - 5) + '.png';
                    } else {
                        v.icon.iconUrl = v.icon.iconUrl.substring(0, v.icon.iconUrl.length - 4) + '.png';
                    }
                    v.icon.iconSize = [18, 18];

                }
            });
            //$scope.centerInset.zoom = 12;
        }
        $scope.getSamples = function (id) {
            if (id > 0) {
                return (new sampleService()).$getByStationId({
                    stationId: id
                });
            }
        }
        $scope.getBenthicSamples = function (id) {
            if (id > 0) {
                return (new benthicSampleService()).$getByStationId({
                    stationId: id
                });
            }
        }
        $scope.goToQuery = function (stnId, paramId,startDate, endDate ) {
            stnId = stnId;
            paramId = paramId;
            var startDate, endDate;
            if ($scope.dataIsOne) {
                startDate = $scope.sampleDate - (24 * 60 * 60 * 1000);
                endDate = $scope.sampleDate + (24 * 60 * 60 * 1000);
            } else {
                startDate = $scope.api.getScope().chart.xAxis.scale().domain()[0] - (24 * 60 * 60 * 1000);
                endDate = $scope.api.getScope().chart.xAxis.scale().domain()[1] + (24 * 60 * 60 * 1000);
            }
            
            startDate = $scope.formatDate(startDate);
            endDate = $scope.formatDate(endDate);
            $state.go('home.query', { stationId: stnId, parameterId: paramId, startDate: startDate, endDate: endDate, dataType: $scope.dataType });
        }

        $scope.formatDate = function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }

        $scope.getStats = function () {
             var promises = [                
                $scope.getStationRichness(),
                $scope.getBenthicStationRichness(),
                $scope.getStations(),
                $scope.getHomeStats()
            ]
             $q.all(promises)
            .then(function (values) {

                $scope.stationsCounts = values[0].data;
                $scope.benthicStationsCounts = values[1].data;
                $scope.stations = values[2].value;
                $scope.cmcStats = values[3].data[0];                
                $scope.stationsLoading = false;
                $scope.stationsToMapMarkers('wq');

                //var aMonthAgo = new Date();
                //aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);
                //$scope.strAMonthAgo = aMonthAgo.toJSON();
                
            });
            
            
            
           
        };

        $scope.getStationRichness = function () {
            return $http({ method: 'GET', url: 'odata/GetStationRichness' });
        }
        $scope.getBenthicStationRichness = function () {
            return $http({ method: 'GET', url: 'odata/GetBenthicStationRichness' });
        }
        $scope.getStations = function () {
            return (new stationService()).$getAll();
        }
        $scope.getHomeStats = function () {
            return $http({ method: 'GET', url: 'odata/GetHomeStats' });
        }


        $scope.d3ToImageCallback = function (imageFormats) {
            // Let's use FileSave library to download the image
            FileSaver.saveAs(imageFormats.blob, 'myChart.png');
        };
        $scope.getPlotData = function (paramId, paramName, depth) {
            
            $scope.eventDateTimes = [];
            $scope.eventData = [];
            $scope.data = [];
            var dataRaw = [];
            if ($scope.dataType == 'wq') {
                angular.forEach($scope.samples, function (value, key) {
                    if ((value.Parameter.Name + ' ' + value.Parameter.Units) == paramName && value.Depth == depth) {
                        dataRaw.push({ x: moment(value.Event.DateTime), y: value.Value });
                    }
                });
            } else {
                angular.forEach($scope.allMetrics, function (value, key) {
                    dataRaw.push({ x: moment(value.dt), y: value[paramId] });
                })
            }

           
            function findMinMax(arr,c) {
                let min = arr[0][c], max = arr[0][c];

                for (let i = 1, len = arr.length; i < len; i++) {
                    let v = arr[i][c];
                    min = (v < min) ? v : min;
                    max = (v > max) ? v : max;
                }

                return [min, max];
            }

            if (dataRaw.length == 1) {
                $scope.dataIsOne = true;
                $scope.sampleDate = dataRaw[0].x;
            } else {
                $scope.dataIsOne = false;
            }
            $scope.plotLoading = false;
            if (dataRaw.length > 0) {
                
                var minMaxY = findMinMax(dataRaw,'y');
                var minMaxX = findMinMax(dataRaw, 'x');
                var rangeY = (minMaxY[1] - minMaxY[0])
                
                
                var rangeX = (minMaxX[1] - minMaxX[0]) 
                //$log.log('range')
                //$log.log(rangeModX);
                //if (rangeModX == 0) {
                //    rangeModX = (24 * 60 * 60 * 1000);
                //}
                function average(arr) {
                    var sums = {}, counts = {}, results = [], x;
                    for (var i = 0; i < arr.length; i++) {
                        x = arr[i].x;
                        if (!(x in sums)) {
                            sums[x] = 0;
                            counts[x] = 0;
                        }
                        sums[x] += arr[i].y;
                        counts[x]++;
                    }

                    for (x in sums) {
                        results.push({ x: moment(x), y: sums[x] / counts[x] });
                    }
                    return results;
                }
                
                var dataRaw = average(dataRaw);


                function compare(a, b) {
                    if (a.x < b.x)
                        return -1;
                    if (a.x > b.x)
                        return 1;
                    return 0;
                }

                dataRaw.sort(compare);

                

                if (typeof (dataRaw[0]) !== 'undefined') {
                    var firstDt = dataRaw[0].x;
                    $scope.stationFirstSample = firstDt.format('MMMM D, YYYY');
                }
                if (typeof (dataRaw[dataRaw.length - 1]) !== 'undefined') {
                    var lastDt = dataRaw[dataRaw.length - 1].x;
                    $scope.stationLastSample = lastDt.format('MMMM D, YYYY');
                }
                //$scope.xMin = minMaxX[0] - rangeModX;
                //$scope.xMax = minMaxX[1] + rangeModX;
                $scope.data = [{
                    values: dataRaw,//plottable
                    key: paramName,
                    color: '#1b75ba'
                }];
                $scope.plotLoading = false;
                $scope.options = {
                    chart: {
                        type: 'lineWithFocusChart',
                        clipEdge:false,
                        //padData: true,
                        // padDataOuter: .1,
                        showLegend:false,                        
                        height: 350,
                        duration: 500,
                        margin: {
                            top: 20,
                            right: 55,
                            bottom: 40,
                            left: 80
                        },
                        x: function (d) {
                            /* Moment.js will attempt to parse the x coordinate 
                            and return a value in milliseconds
                            */
                            return moment.utc(d.x).valueOf();
                        },
                        y: function (d) {
                            return d.y;
                        },
                       
                        //deepWatchData: true,
                        xAxis: {
                            //axisLabel: 'Date',
                            showMaxMin:true,
                            axisLabelDistance: 20,
                            reduceTicks:false,
                            ticks:4,
                            tickFormat: (function (d) {
                                // 3.1) Format the x ticks
                                return d3.time.format('%-m/%-d/%-Y')(new Date(d));
                            }),
                            tickPadding: 15
                        },

                        yAxis: {
                            axisLabel: paramName,
                            axisLabelDistance: 15,
                            tickFormat: function (d) {
                                return d3.format('.02f')(d);
                            },
                            tickPadding:15
                        },

                        //x2Axis: {
                        //    tickFormat: function (d) {
                        //        return '';
                        //    }
                        //},

                        x2Axis: {
                            ticks: 2,
                            tickFormat: function (d) {
                                return d3.time.format('%-m/%-d/%-Y')(new Date(d));
                            }
                        },
                        dispatch: {
                            renderEnd: function (e) {
                                if ($scope.dataType == 'benthic') {

                                    var poorRatio; var medRatio; var goodRatio;
                                    var bg = d3.select('.nv-focus').selectAll('.nv-background');
                                    var width = bg.node().getBBox().width;
                                    var height = bg.node().getBBox().height;

                                    var svg =  d3.select('.nv-focus').selectAll('.nv-groups');
                                    if ($scope.benthicMethod == 'iwl') {
                                        if ($scope.bottomType == 'Muddy') {
                                            poorRatio = 8 / 24;
                                            medRatio = 6 / 24;
                                            goodRatio = 10 / 24;
                                        } else {
                                            poorRatio = 7 / 12;
                                            medRatio = 2 / 12;
                                            goodRatio = 3 / 12;
                                        }
                                    } else {
                                        poorRatio = 20 / 60;
                                        medRatio = 20 / 60;
                                        goodRatio = 20 / 60;
                                    }
                                    svg.selectAll("rect").remove();
                                    //poor
                                    var rectHPoor = poorRatio * height;
                                    svg.insert("rect",':first-child')
                                                      .attr("x", 0)
                                                      .attr("y", height-rectHPoor)
                                                      .attr("width", width)
                                                      .attr("height", rectHPoor)
                                                      .attr("fill", "red")
                                                      .attr("opacity", 0.2);
                                    //medium
                                    var rectHMed = medRatio * height;
                                    svg.insert("rect", ':first-child')
                                                      .attr("x", 0)
                                                      .attr("y", height - rectHMed - rectHPoor)
                                                      .attr("width", width)
                                                      .attr("height", rectHMed)
                                                      .attr("fill", "yellow")
                                                      .attr("opacity", 0.2);
                                    //good
                                    var rectHGood = goodRatio * height;
                                    svg.insert("rect", ':first-child')
                                                      .attr("x", 0)
                                                      .attr("y", 0)
                                                      .attr("width", width)
                                                      .attr("height", rectHGood)
                                                      .attr("fill", "green")
                                                      .attr("opacity", 0.2);
                                }
                            }
                        }
                    }
                    
                    //title: {
                    //     enable: true,
                    //    text: seriesName
                    //}
                    
                };

                if ($scope.dataType == 'benthic') {
                    if ($scope.benthicMethod == 'iwl') {
                        
                        if ($scope.bottomType == 'Muddy') {
                            $scope.options.chart.yDomain = [0, 24];
                        } else {
                            $scope.options.chart.yDomain = [0, 12];
                        }
                    } else {
                        $scope.options.chart.yDomain = [0, 60];
                    }
                }
                if (dataRaw.length == 1 && $scope.dataType=='wq') {
                    delete $scope.options.chart['yDomain'];
                }

                
            }
            
        }
        $scope.quickParamClicked = function (prm) {
            $scope.quickParams.forEach(function (value, key) {
                value.selected = false;
            })
            prm.selected = true;
            if (prm.id == $scope.slctParam) {
                $scope.parameterChanged($scope.slctParam);
            } else {
                $scope.slctParam = prm.id;
            }
        }

        $scope.calculateMetrics = function () {
            
            var calculateEventMetrics = function (event) {
                var metrics; var bottomType = null; var metricCats; var constants; var iwlGroup;
                var method = event[0].BenthicEvent.Group.BenthicMethod;
                $scope.benthicMethod = method;

                if (method == 'allarm') {
                    metrics = {
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
                        'mis': 0,
                        'wqsGrade': ''
                    };
                } else {
                    metrics = {
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
                }
                var dt = event[0].BenthicEvent.DateTime;
                if (method == 'iwl') {
                    angular.forEach(event[0].BenthicEvent.BenthicEventConditions, function (v, k) {
                        if (v.BenthicCondition.Code == 'BT') {
                            bottomType = v.Value;
                            $scope.bottomType = bottomType;
                        }
                    })
                    if (bottomType == 'Rocky') {
                        iwlGroup = 'iwlRockyGroup';
                        constants = iwlRockyConstants;
                        metricCats = [0, 1, 2];
                    } else if (bottomType == 'Muddy') {
                        iwlGroup = 'iwlMuddyGroup';
                        constants = iwlMuddyConstants;
                        metricCats = [0, 3, 6];
                    } else {
                        iwlGroup = 'iwlRockyGroup';
                        constants = iwlRockyConstants;
                        metricCats = [0, 1, 2];
                    }
                    
                    angular.forEach(event, function (value, index) {
                        if (!isNaN(parseFloat(value.Value)) && isFinite(value.Value)) {
                            if (value.BenthicParameter.Method == 'iwl' || value.BenthicParameter.Method == 'both') {
                                metrics.total = metrics.total + parseFloat(value.Value);
                                if (value.BenthicParameter[iwlGroup] == 1) {
                                    metrics.metric1Total = metrics.metric1Total + parseFloat(value.Value);
                                } if (value.BenthicParameter[iwlGroup] == 2) {
                                    metrics.metric2Total = metrics.metric2Total + parseFloat(value.Value);
                                } if (value.BenthicParameter.tolerant == true) {
                                    metrics.metric3Total = metrics.metric3Total + parseFloat(value.Value);
                                } if (value.BenthicParameter.nonInsects == true) {
                                    metrics.metric4Total = metrics.metric4Total + parseFloat(value.Value);
                                } if (value.BenthicParameter[iwlGroup] == 3) {
                                    metrics.metric5Total = metrics.metric5Total + parseFloat(value.Value);
                                } if (value.BenthicParameter[iwlGroup] == 4) {
                                    metrics.metric6Total = metrics.metric6Total + parseFloat(value.Value);
                                }
                            }
                        }

                    });
                    metrics.metric1 = metrics.metric1Total / metrics.total;
                    metrics.metric2 = metrics.metric2Total / metrics.total;
                    metrics.metric3 = metrics.metric3Total / metrics.total;
                    metrics.metric4 = metrics.metric4Total / metrics.total;
                    metrics.metric5 = metrics.metric5Total / metrics.total;
                    metrics.metric6 = metrics.metric6Total / metrics.total;



                    if (metrics.metric1 > constants.metric1Upper) {                    
                        metrics.metric1Category = metricCats[2];
                        metrics.total2 = metrics.total2 + 1;
                    } else if (metrics.metric1 >= constants.metric1Lower && metrics.metric1 <= constants.metric1Upper) {
                        metrics.metric1Category = metricCats[1];
                        metrics.total1 = metrics.total1 + 1;
                    } else if (metrics.metric1 < constants.metric1Lower) {
                        metrics.metric1Category = metricCats[0];
                    }

                    if (metrics.metric2 > constants.metric2Upper) {
                        if (bottomType == 'Rocky') {
                            metrics.metric2Category = metricCats[0];
                        } else if (bottomType == 'Muddy') {
                            metrics.metric2Category = metricCats[2];
                            metrics.total2 = metrics.total2 + 1;
                        }                                       
                    } else if (metrics.metric2 >= constants.metric2Lower && metrics.metric2 <= constants.metric2Upper) {
                        metrics.metric2Category = metricCats[1];
                        metrics.total1 = metrics.total1 + 1;
                    } else if (metrics.metric2 < constants.metric2Lower) {
                        if (bottomType == 'Rocky') {
                            metrics.metric2Category = metricCats[2];
                            metrics.total2 = metrics.total2 + 1;                        
                        } else if (bottomType == 'Muddy') {
                            metrics.metric2Category = metricCats[0];
                        }                   
                    }

                    if (metrics.metric3 > constants.metric3Upper) {
                        metrics.metric3Category = metricCats[0];
                    } else if (metrics.metric3 >= constants.metric3Lower && metrics.metric3 <= constants.metric3Upper) {
                        metrics.metric3Category = metricCats[1];
                        metrics.total1 = metrics.total1 + 1;
                    } else if (metrics.metric3 < constants.metric3Lower) {
                        metrics.metric3Category = metricCats[2];
                        metrics.total2 = metrics.total2 + 1;
                    }

                    if (metrics.metric4 > constants.metric4Upper) {
                        metrics.metric4Category = metricCats[0];
                    } else if (metrics.metric4 >= constants.metric4Lower && metrics.metric4 <= constants.metric4Upper) {
                        metrics.metric4Category = metricCats[1];
                        metrics.total1 = metrics.total1 + 1;
                    } else if (metrics.metric4 < constants.metric4Lower) {
                        metrics.metric4Category = metricCats[2];
                        metrics.total2 = metrics.total2 + 1;
                    }

                    if (metrics.metric5 > constants.metric5Upper) {
                        metrics.metric5Category = metricCats[0];
                    } else if (metrics.metric5 >= constants.metric5Lower && metrics.metric5 <= constants.metric5Upper) {
                        metrics.metric5Category = metricCats[1];
                        metrics.total1 = metrics.total1 + 1;
                    } else if (metrics.metric5 < constants.metric5Lower) {
                        metrics.metric5Category = metricCats[2];
                        metrics.total2 = metrics.total2 + 1;
                    }
                    if (metrics.metric6 > constants.metric6Upper) {
                        metrics.metric6Category = metricCats[2];
                        metrics.total2 = metrics.total2 + 1;
                    } else if (metrics.metric6 >= constants.metric6Lower && metrics.metric6 <= constants.metric6Upper) {
                        metrics.metric6Category = metricCats[1];
                        metrics.total1 = metrics.total1 + 1;
                    } else if (metrics.metric6 < constants.metric6Lower) {
                        metrics.metric6Category = metricCats[0];                    
                    }
                    metrics.mis = (metrics.total1 * metricCats[1]) + (metrics.total2 * metricCats[2]);
                    if (metrics.mis >= constants.acceptable) {
                        metrics.ecologicalCondition = ' is Acceptable.';
                    } else if (metrics.mis <= constants.unacceptable) {
                        metrics.ecologicalCondition = 'is Unacceptable.';
                    } else {
                        metrics.ecologicalCondition = 'cannot be determined.';
                    }
                    
                } else if (method == 'allarm') {
                    angular.forEach(event, function (value, index) {
                        if (!isNaN(parseFloat(value.Value)) && isFinite(value.Value)) {
                            if (value.BenthicParameter.allarmGroup == 1) {
                                if (value.Value > 0 && value.Value < 10) {
                                    metrics.grp1RareTotal = metrics.grp1RareTotal + 1;
                                } else if (value.Value >= 10 && value.Value < 100) {
                                    metrics.grp1CommonTotal = metrics.grp1CommonTotal + 1;
                                } else if (value.Value >= 100) {
                                    metrics.grp1DominantTotal = metrics.grp1DominantTotal + 1;
                                }
                            } else if (value.BenthicParameter.allarmGroup == 2) {
                                if (value.Value > 0 && value.Value < 10) {
                                    metrics.grp2RareTotal = metrics.grp2RareTotal + 1;
                                } else if (value.Value >= 10 && value.Value < 100) {
                                    metrics.grp2CommonTotal = metrics.grp2CommonTotal + 1;
                                } else if (value.Value >= 100) {
                                    metrics.grp2DominantTotal = metrics.grp2DominantTotal + 1;
                                }
                            } else if (value.BenthicParameter.allarmGroup == 3) {
                                if (value.Value > 0 && value.Value < 10) {
                                    metrics.grp3RareTotal = metrics.grp3RareTotal + 1;
                                } else if (value.Value >= 10 && value.Value < 100) {
                                    metrics.grp3CommonTotal = metrics.grp3CommonTotal + 1;
                                } else if (value.Value >= 100) {
                                    metrics.grp3DominantTotal = metrics.grp3DominantTotal + 1;
                                }
                            }
                            metrics.grp1Total = metrics.grp1RareTotal * allarmConstants.grp1Rare +
                                metrics.grp1CommonTotal * allarmConstants.grp1Common +
                                metrics.grp1DominantTotal * allarmConstants.grp1Dominant;
                            metrics.grp2Total = metrics.grp2RareTotal * allarmConstants.grp2Rare +
                                metrics.grp2CommonTotal * allarmConstants.grp2Common +
                                metrics.grp2DominantTotal * allarmConstants.grp2Dominant;
                            metrics.grp3Total = metrics.grp3RareTotal * allarmConstants.grp3Rare +
                                metrics.grp3CommonTotal * allarmConstants.grp3Common +
                                metrics.grp3DominantTotal * allarmConstants.grp3Dominant;
                            metrics.mis = metrics.grp1Total + metrics.grp2Total +
                                metrics.grp3Total;
                            if (metrics.mis < allarmConstants.lowerLimit) {
                                metrics.wqsGrade = 'Good';
                            } else if (metrics.mis >= allarmConstants.lowerLimit && metrics.mis <= allarmConstants.upperLimit) {
                                metrics.wqsGrade = 'Fair';
                            } else if (metrics.wqs > allarmConstants.upperLimit) {
                                metrics.wqsGrade = 'Poor';
                            }
                        }
                    })
                } else {
                    $scope.isTier2 = true;
                }
                metrics.dt = dt;
                return metrics;
            }

            var uniqueEvents = [];
            $scope.metrics = [];
            angular.forEach($scope.benthicSamples, function (value, index) {
                if (uniqueEvents.indexOf(value.BenthicEventId) == -1) {
                    uniqueEvents.push(value.BenthicEventId)

                }
            });

            $scope.allMetrics = [];
            angular.forEach(uniqueEvents, function (value, index) {
                var event = [];
                angular.forEach($scope.benthicSamples, function (v, k) {
                    if (value == v.BenthicEventId) {
                        event.push(v);
                    }
                });
                var eventMetrics = calculateEventMetrics(event);
                $scope.allMetrics.push(eventMetrics);
            });
        }


        $scope.getPlotParameters = function (type) {
            $scope.quickParamNames = ['Water temperature deg C','Dissolved oxygen mg/L']//chl:220,221,222,223,224;do (mg/L): 227,228,328,331,341; secchi: 261,262; temp: 339,346,333,265,266,267, salinity: 248,249,250,364,629,330,342,321,247 
            $scope.plotParameters = [];
            $scope.quickParams = [];
            var parameterIds = [];
            if (type == 'benthic') {
                $scope.dataType = 'benthic';
                angular.forEach($scope.allmetrics, function (value, key) {
                    $scope.plotParameters.push()
                });
                $scope.plotParameters = [
                    {
                        name: 'Multimetric Index Score',
                        value: 'mis'
                    },
                    {
                        name: 'Metric 1',
                        value: 'metric1'
                    },
                    {
                        name: 'Metric 2',
                        value: 'metric2'
                    },
                    {
                        name: 'Metric 3',
                        value: 'metric3'
                    },
                    {
                        name: 'Metric 4',
                        value: 'metric4'
                    }
                ]

                if ($scope.quickParams.length > 0) {
                    $scope.quickParamClicked($scope.quickParams[0]);
                } else {
                    if ($scope.slctParam == $scope.plotParameters[0].value) {
                        $scope.parameterChanged($scope.slctParam);
                    }
                    $scope.slctParam = $scope.plotParameters[0].value;
                }
            } else {
                $scope.dataType = 'wq';

                angular.forEach($scope.samples, function (value, key) {
                    if (!value.Parameter.isCalibrationParameter) {
                        var len = $filter('filter')($scope.plotParameters, { 'name': value.Parameter.Name + ' ' + value.Parameter.Units }, true).length;
                        if (len < 1) {
                            var paramName = "";
                            $scope.plotParameters.push({
                                'value': value.ParameterId,
                                'name': value.Parameter.Name + ' ' + value.Parameter.Units,
                                'tier': value.Parameter.Tier,
                                'equipment': value.Parameter.Equipment,
                                'code': value.Parameter.Code,
                                'parameterCodes': [value.Parameter.Code]
                            });
                            if ($scope.quickParamNames.indexOf(value.Parameter.Name + ' ' + value.Parameter.Units) > -1) {

                                $scope.quickParams.push({
                                    id: value.ParameterId,
                                    name: value.Parameter.Name + ' ' + value.Parameter.Units,
                                    description: value.Parameter.Description,
                                    units: value.Parameter.Units,
                                    tier: value.Parameter.Tier
                                });


                            }
                        }
                        len = $filter('filter')($scope.plotParameters, { 'code': value.Parameter.Code }).length;

                        if (len < 1) {
                            var editParam = $filter('filter')($scope.plotParameters, { 'name': value.Parameter.Name + ' ' + value.Parameter.Units }, true);

                            editParam[0].code += ', ' + value.Parameter.Code;
                            editParam[0].equipment += ', ' + value.Parameter.Equipment;
                            editParam[0].parameterCodes.push(value.Parameter.Code);
                        }
                    }
                });

                if ($scope.quickParams.length > 0) {
                    $scope.quickParamClicked($scope.quickParams[0]);
                } else {
                    if ($scope.slctParam == $scope.plotParameters[0].value) {
                        $scope.parameterChanged($scope.slctParam);
                    }
                    $scope.slctParam = $scope.plotParameters[0].value;
                }
            }
            
        }
        $scope.fillPlot = function (seriesName) {
            // 3) Chart configuration
            
            
        }

        $scope.refreshMap = function () {
            leafletData.getMap("mainMap").then(function (map) {
                $timeout(function () {
                    map.invalidateSize();
                },1);
            });
        }

        $scope.loadInsetMap = function () {

            //$scope.slctParam = $scope.plotParameters[0].value;
            leafletData.getMap("insetMap").then(function (map) {
                $scope.centerInset.zoom = 12;
                $timeout(function () {
                    map.invalidateSize();
                    //$scope.markersInset = $scope.markers;
                    
                },1);
            });
        }

        $scope.getWatershed = function () {
            $http({ method: 'GET', url: '../../../SpatialData/huc8.json' }).success(function (data, status, headers, config) {
                

                angular.extend($scope.layers.overlays, {
                    countries: {
                        name: 'Watersheds',
                        type: 'geoJSONShape',
                        data: data,
                        visible: true,
                        layerOptions: {
                            style: {
                                color: '#3D5963',
                                fillColor: '#006666',
                                weight: 2.0,
                                opacity: 1,
                                fillOpacity: 0
                            },
                            onEachFeature: onEachFeature
                        }

                    }
                });

                function onEachFeature(feature, layer) {
                    layer.bindPopup('<h4>' + layer.feature.properties.ACTNAME + '</h4>');
                    layer.on({
                        click: function () {
                            $scope.country = layer.feature.properties.name;
                            

                        }
                    })
                }
                
            });
        }

        $scope.$watch("slctParam", function (newValue, oldValue) {
            $scope.parameterChanged(newValue);
        });

        $scope.$watch("slctDepth", function (newValue, oldValue) {
            $scope.getPlotData($scope.slctParam, $scope.slctParamName, newValue);
        });

        $scope.parameterChanged = function (newValue) {
            var name = '';
            if ($scope.dataType == 'wq') {
                angular.forEach($scope.plotParameters, function (v, k) {
                    if (v.value == newValue) {
                        name = v.name;
                        $scope.slctParamName = v.name;
                        $scope.slctParamCode = v.code;
                        $scope.slctParameterCodes = v.parameterCodes;
                        $scope.slctParamEquip = v.equipment;
                    }
                })
                $scope.depths = [];
                $scope.depthsDrop = [];
                $scope.slctDepth = null;
                angular.forEach($scope.samples, function (value, key) {
                    if (value.Parameter.Id == newValue) {
                        var depth = value.Depth;
                        if ($scope.depths.indexOf(depth) == -1) {
                            $scope.depths.push(depth);
                            if (depth !== null) {
                                $scope.depthsDrop.push({ name: depth, value: depth });
                            } else {
                                $scope.depthsDrop.push({ name: 'Null', value: null });
                            }
                        }
                    }
                });
                function compare(a, b) {
                    if (a.value < b.value)
                        return -1;
                    if (a.value > b.value)
                        return 1;
                    return 0;
                }
                $scope.depthsDrop.sort(compare);

                $timeout(function () {
                    $('.selectpicker').selectpicker('refresh');
                }, 1);
                if (typeof ($scope.depthsDrop[0]) !== 'undefined') {
                    $scope.slctDepth = $scope.depthsDrop[0].value;
                }
                $scope.slctParamName = name;
                $scope.getPlotData(newValue, name, $scope.slctDepth);
            } else {
                angular.forEach($scope.plotParameters, function (v, k) {
                    if (v.value == newValue) {
                        $scope.slctParamName = v.name;
                    }
                })
                $scope.getPlotData(newValue, $scope.slctParamName)
            }
        }

        $scope.getResultsParameters = function () {
            $scope.downloading = true;
            var dataWithHeaders = [];


            var parameters = '';
            angular.forEach($scope.slctParameterCodes, function (v, k) {
                parameters += ',' + v;
            })
            
            var deferred = $q.defer();
            var requestUrl = "odata/GetSamplesDownloadPublicParameters";

            var req = {
                method: 'POST',
                url: requestUrl,
                data: { ids: parameters }
            }
            $http(req).success(function (data, status, headers, config) {                
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
       
        $scope.initialize = function () {
            $scope.dataTypes = [{ name: 'Water Quality' }, { name: 'Benthic Macroinvertebrates' }];
            $scope.tab = "Water Quality";
          


            $scope.isSet = function (checkTab) {
                return $scope.tab === checkTab;
            };

            $scope.setTab = function (activeTab) {
                if (activeTab == 'Benthic Macroinvertebrates') {
                    $scope.getPlotParameters('benthic');
                } else {
                    $scope.getPlotParameters('wq');
                }
                $scope.contentDetails = activeTab;
                $scope.tab = activeTab;
            };
            $scope.showPanel = false;
            $scope.showLayersPanel = true;
            $scope.stationsLoading = true;
            $scope.current = $state.current;
            $scope.getStats();
            $scope.stnMarkers = {};
            $scope.marker = {
                stnName: '',
                lat: '',
                lng: '',
                message: ''
            }
            $scope.markerInset = {
                lat: '',
                lng: ''
            }
            $scope.showMap = false;
            $scope.getWatershed();
            $scope.contents = 'test';
            
        };
        angular.extend($scope, {
            center: {
                lat: 39.5,
                lng: -77.61,
                zoom: 7
                
            },
            defaults: {
                zoomControl: false,
                controls: {
                    layers: {
                        visible: true,
                        position: 'topright',
                        collapsed: true
                    }
                }
            },
            centerInset: {
                lat: 39.8,
                lng: -76.61,
                zoom: 6
            },
            legend: {
                title: 'Total Sampling Events',
                position: 'bottomleft',
                colors: ['#42d9cb', '#03bdac', '#158579', '#436965'],
                labels: ['< 10', '10 - 50', '51 - 100', '> 100']
            },
            
            layers: {
                baselayers: {
                 osm: {
                        name: "OpenStreetMap",
                        type: "xyz",
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        layerOptions: {
                            subdomains: ["a", "b", "c"],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
                   
                    //osmJustShoreline: {
                    //    name: "OpenStreetMapJustShoreline",
                    //    type: "xyz",
                    //    url: "https://tile.osm.ch/switzerland/{z}/{x}/{y}.png",
                    //    layerOptions: {
                    //        subdomains: ["a", "b", "c"],
                    //        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    //        continuousWorld: true
                    //    }
                    //},
                    //osmBw:{
                    //    name: "OpenStreetMapBw",
                    //    type: "xyz",
                    //    url: "http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
                    //    layerOptions: {
                    //        subdomains: ["a", "b", "c"],
                    //        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    //        continuousWorld: true
                    //    }
                    //},
                    
                    //CartoDB_Positron:{
                    //    name: "cartodbPositron",
                    //    type: "xyz",
                    //    url:'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', 
                    //    layerOptions: {
                    //        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                    //        continuosWorld:true
                    //    }
                    //},
                    //CartoDB_DarkMatter:{
                    //    name: "darkMatter",
                    //    type: "xyz",
                    //    url:'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', 
                    //    layerOptions: {
                    //        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                    //        continuosWorld:true
                    //    }
                    //}
                },
                
                overlays: {
                    wq: { name: 'wq', type: 'group', visible: true, layerParams: { showOnSelector: false } },
                    benthic: { name: 'benthic', type: 'group', visible: true, layerParams: { showOnSelector: false } }
                }
            },
            controls: {
                custom: [
                    new L.Control.zoomHome({ position: 'topleft' })
                    
                ]
            },
            markers: {}
        });
        $scope.$on('leafletDirectiveMarker.click', function (event, args) {
            // Check args param has leafletEvent, this is leaflet click event that
            // contains latitude and logitude from click            
            //$log.log(args.leafletObject.options.stnName);            
            
        });

        //$scope.$on('leafletDirectiveMarker.mouseover', function (event, args) {
        //    $log.log('I am over!');
        //    var popup = L.popup({ offset: L.point(0, 0) })
        //                .setLatLng([args.model.lat, args.model.lng])
        //                .setContent(args.model.message)
        //    leafletData.getMap().then(function (map) {
        //        popup.openOn(map);
        //    });
        //});
        //$scope.$on('leafletDirectiveMarker.mouseout', function (event) {
        //    leafletData.getMap().then(function (map) {
        //        map.closePopup();
        //    });
        //});
        $scope.$watch("center.zoom", function (zoom) {
            if (zoom > 8) {
                angular.forEach($scope.markers, function (v, k) {
                    v.icon.iconSize = [18, 18]
                })
            } else {
                angular.forEach($scope.markers, function (v, k) {
                    v.icon.iconSize = [15, 15]
                })
            }
        });

        $scope.$watch("centerInset.zoom", function (zoom) {
            if (zoom > 8) {
                angular.forEach($scope.markersInset, function (v, k) {
                    if (v.icon.iconUrl.substring(v.icon.iconUrl.length - 5, v.icon.iconUrl.length - 4) == 'h') {
                        v.icon.iconSize = [40, 40]
                        
                    } else {
                        v.icon.iconSize = [15, 15]
                    }
                })
            } else {
                angular.forEach($scope.markersInset, function (v, k) {
                    if (v.icon.iconUrl.substring(v.icon.iconUrl.length - 5, v.icon.iconUrl.length - 4) == 'h') {
                        v.icon.iconSize = [35, 35]
                    } else {
                        v.icon.iconSize = [10, 10]
                    }
                })
            }
        });
    };
    
    homeController.$inject = ['$scope', 'stationService', 'leafletMapEvents', 'leafletData', '$log', '$http',
        '$filter', '$q', 'benthicSampleService', 'sampleService', '$timeout', 'FileSaver', 'Blob', '$state', '$rootScope','$window'
    ];
    app.controller("homeController", homeController);
}(angular.module("cmcPublic")));