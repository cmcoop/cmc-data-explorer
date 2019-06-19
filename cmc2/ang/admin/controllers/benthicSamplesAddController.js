(function (app) {
    var benthicSamplesAddController = function ($scope, $filter, $log, $q, $anchorScroll, stationGroupService,
                                            benthicParameterService,
                                            benthicEventService, benthicSampleService,
                                            userGroup,userGroupId, userRole, userId, userName, userGroupId,
                                            qualifierService, problemService, conditionService,
                                            eventConditionService, groupService, benthicEventConditionService,
                                            benthicConditionService,benthicConditionCategoriesService, userService,benthicMonitorLogService, 
                                            notificationFactory, stationService, oData, 
                                            leafletMapEvents, leafletData, $timeout, $window) {


        $scope.initialize = function () {
            if (userRole == 'Monitor' | userRole == 'Coordinator') {
                $scope.isMonitorOrCoordinator = true;                
            } else {
                $scope.isMonitorOrCoordinator = false;
            }

            $scope.loading = true;
            $scope.userRole = userRole;
            $scope.userGroup = userGroup;
            $scope.userName = userName;
            $scope.noParameters = '';
            $scope.showAllarmMetrics = false;
            $scope.showIwlMetrics = false;

           
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
            $scope.setVariables();
            var promises = [
                $scope.getStations(userGroupId),
                $scope.getGroups(),               
                //$scope.getParameters(),
                $scope.getGroup(),
                $scope.getConditions(),
                //$scope.getUsers()
                //$scope.getParametersWoSampleDepth()
            ]
            

            $q.all(promises)
            .then(function (values) {
                
                //$scope.parameters = [];
                $scope.netTimeCodes = ['CT.1', 'CT.2', 'CT.3', 'CT.4'];

                $scope.groupsList = [];

                $scope.stations = values[0].value;

                $scope.stationsList = [{
                    "name": "",
                    "value": null
                }];
                angular.forEach($scope.stations, function (value, key) {
                    $scope.stationsList.push(
                        {
                            value: value.Station.Id,
                            name: value.Station.Name
                        }
                      );
                });
                if ($scope.stationsList.length > 1) {
                    $scope.newEvent.StationId = $scope.stationsList[1].value;
                    $scope.noStations = '';
                } else {
                    $scope.noStations = 'There are no stations for this group.';
                }

                $scope.groups = values[1].value;
                $scope.groupIds = [];
                angular.forEach($scope.groups, function (value, key) {
                    if (value.BenthicMethod == 'allarm' | value.BenthicMethod == 'iwl') {
                        $scope.groupsList.push(
                            {
                                value: value.Id,
                                name: value.Name
                            }
                        );
                        $scope.groupIds.push(value.Id);
                    }
                });

                var grpId = parseInt(userGroupId);
                $scope.groupHasNoMethod = false;
                if ($scope.groupIds.indexOf(grpId) < 0) {
                    if ($scope.isMonitorOrCoordinator) {
                        $scope.groupHasNoMethod = true;
                    } else {
                        $scope.slctGroupId = $scope.groupsList[0].value;
                    }
                } else {
                    $scope.slctGroupId = grpId;
                }

                //$scope.slctGroupId = parseInt(userGroupId);
                $scope.conditions = values[3].value;

                $scope.setupConditionDropdowns();

                
                $scope.bottomType = 'Muddy';
                

                   
                $scope.bottomTypeFilter = function (item) {
                    var bType = '';
                    angular.forEach($scope.conditions, function (v, k) {
                        if (v.Code == 'BT') {
                            bType = v.Value;
                        }
                    })
                    if (item.BottomType == null || item.BottomType === bType) {
                        return item;
                    }
                };

                $scope.conditionMethodFilter = function (item) {
                    var benthicMethod = $scope.benthicMethod;                   
                    if ((item.Method === 'both' || item.Method === benthicMethod) && $scope.netTimeCodes.indexOf(item.Code)==-1 ) {
                        return item;
                    }
                };
                $scope.collectionTimeFilter = function (item) {
                    if ($scope.netTimeCodes.indexOf(item.Code) > -1) {
                        return item;
                    }
                }
                $scope.loading = false;
                //$scope.groupUsers = values[4].value;


                //$scope.populateUserDropdowns($scope.grpId);
                
                //$scope.user[0]['Id'] = $scope.groupUsersList[0].value;

                //$scope.populateParameterFormElements(userGroupId);
                //var grp = $scope.getGroup(grpId);
                //$scope.parameterGroups = grp.ParameterGroups;

                //angular.forEach($scope.parameterGroups, function (value, key) {
                //    $scope.parameters.push(value.Parameter);
                //});
            });
        };

      

        $scope.populateUserDropdowns = function (grpId) {
            if (grpId !== null && typeof grpId !== 'undefined') {
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
        }

        // set maximum date to tomorrow
        $scope.maxDateMoment = moment().add(1, 'day').format('YYYYMMDD');

        
        $scope.$watch('conditions', function (newValue, oldValue) {
            $log.log(newValue)
            angular.forEach(newValue, function (v, k) {
                if (v.Code == 'BT') {
                    $scope.bottomType = v.Value;
                }
            })
        },true);
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
                //$log.log('total');
                //$log.log($scope.metrics.total);
                
                //$scope.newSamples['WPL']['Value'] = '0';
                //$scope.newSamples['H']['Value'] = '0';
                //$scope.newSamples['RB']['Value'] = '0';
                //$scope.newSamples['NNCL']['Value'] = '11';
                //$scope.newSamples['BL']['Value'] = '29';
                //$scope.newSamples['CFL']['Value'] = '8';
                //$scope.newSamples['DN']['Value'] = '49';
                //$scope.newSamples['FF']['Value'] = '0';
                //$scope.newSamples['AF']['Value'] = '1';
                //$scope.newSamples['NCL']['Value'] = '0';
                //$scope.newSamples['MN']['Value'] = '0';
                //$scope.newSamples['SN']['Value'] = '0';
                //$scope.newSamples['AW']['Value'] = '0';
                //$scope.newSamples['BFL']['Value'] = '0';
                //$scope.newSamples['ML']['Value'] = '4';
                //$scope.newSamples['S']['Value'] = '0';
                //$scope.newSamples['GS']['Value'] = '0';
                //$scope.newSamples['CL']['Value'] = '0';
                //$scope.newSamples['L']['Value'] = '0';
                //$scope.newSamples['C']['Value'] = '55';
                //$scope.newSamples['SB']['Value'] = '7';
                //$scope.newSamples['SC']['Value'] = '53';


                angular.forEach($scope.newSamples, function (value, index) {
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

            } else if ($scope.benthicMethod == 'iwl' && $scope.bottomType == 'Rocky') {


                //$scope.newSamples['W']['Value'] = '0';
                //$scope.newSamples['F']['Value'] = '0';
                //$scope.newSamples['L']['Value'] = '1';
                //$scope.newSamples['C']['Value'] = '0';
                //$scope.newSamples['SB']['Value'] = '0';
                //$scope.newSamples['SC']['Value'] = '0';
                //$scope.newSamples['SF']['Value'] = '11';
                //$scope.newSamples['M']['Value'] = '29';
                //$scope.newSamples['DD']['Value'] = '0';
                //$scope.newSamples['HFA']['Value'] = '8';
                //$scope.newSamples['CN']['Value'] = '55';
                //$scope.newSamples['MC']['Value'] = '49';
                //$scope.newSamples['B']['Value'] = '53';
                //$scope.newSamples['MI']['Value'] = '7';
                //$scope.newSamples['BF']['Value'] = '0';
                //$scope.newSamples['MTF']['Value'] = '1';                
                //$scope.newSamples['GS']['Value'] = '0';
                //$scope.newSamples['LS']['Value'] = '0';
                //$scope.newSamples['CL']['Value'] = '0';
                //$scope.newSamples['OO']['Value'] = '0';
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
                angular.forEach($scope.newSamples, function (value, index) {                    
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

                if ($scope.iwlMetrics.metric3 > iwlRockyConstants.metric5Upper) {
                    $scope.iwlMetrics.metric3Category = 0;

                } else if ($scope.iwlMetrics.metric3 >= iwlRockyConstants.metric5Lower && $scope.iwlMetrics.metric3 <= iwlRockyConstants.metric5Upper) {
                    $scope.iwlMetrics.metric3Category = 1;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric3 < iwlRockyConstants.metric5Lower) {
                    $scope.iwlMetrics.metric3Category = 2;
                    $scope.iwlMetrics.total2 = $scope.iwlMetrics.total2 + 1;
                }

                if ($scope.iwlMetrics.metric4 > iwlRockyConstants.metric6Upper) {
                    $scope.iwlMetrics.metric4Category = 2;
                    $scope.iwlMetrics.total2 = $scope.iwlMetrics.total2 + 1;
                } else if ($scope.iwlMetrics.metric4 >= iwlRockyConstants.metric6Lower && $scope.iwlMetrics.metric4 <= iwlRockyConstants.metric6Upper) {
                    $scope.iwlMetrics.metric4Category = 1;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric4 < iwlRockyConstants.metric6Lower) {
                    $scope.iwlMetrics.metric4Category = 0;
                }

                if ($scope.iwlMetrics.metric5 > iwlRockyConstants.metric3Upper) {
                    $scope.iwlMetrics.metric5Category = 0;
                } else if ($scope.iwlMetrics.metric5 >= iwlRockyConstants.metric3Lower && $scope.iwlMetrics.metric5 <= iwlRockyConstants.metri35Upper) {
                    $scope.iwlMetrics.metric5Category = 1;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric5 < iwlRockyConstants.metric3Lower) {
                    $scope.iwlMetrics.metric5Category = 2;
                    $scope.iwlMetrics.total2 = $scope.iwlMetrics.total2 + 1;
                }

                if ($scope.iwlMetrics.metric6 > iwlRockyConstants.metric4Upper) {
                    $scope.iwlMetrics.metric6Category = 0;
                } else if ($scope.iwlMetrics.metric6 >= iwlRockyConstants.metric4Lower && $scope.iwlMetrics.metric6 <= iwlRockyConstants.metric4Upper) {
                    $scope.iwlMetrics.metric6Category = 1;
                    $scope.iwlMetrics.total1 = $scope.iwlMetrics.total1 + 1;
                } else if ($scope.iwlMetrics.metric6 < iwlRockyConstants.metric4Lower) {
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
            } else if ($scope.benthicMethod == 'iwl' && $scope.bottomType == 'Muddy') {////muddy
                //$scope.newSamples['W']['Value'] = '0';
                //$scope.newSamples['F']['Value'] = '0';
                //$scope.newSamples['L']['Value'] = '1';
                //$scope.newSamples['C']['Value'] = '0';
                //$scope.newSamples['SB']['Value'] = '0';
                //$scope.newSamples['SC']['Value'] = '0';
                //$scope.newSamples['SF']['Value'] = '11';
                //$scope.newSamples['M']['Value'] = '29';
                //$scope.newSamples['DDNG']['Value'] = '0';
                //$scope.newSamples['HFA']['Value'] = '8';
                //$scope.newSamples['CN']['Value'] = '55';
                //$scope.newSamples['MC']['Value'] = '49';
                //$scope.newSamples['B']['Value'] = '53';
                //$scope.newSamples['MI']['Value'] = '7';
                //$scope.newSamples['BF']['Value'] = '0';
                //$scope.newSamples['MTF']['Value'] = '1';
                //$scope.newSamples['GS']['Value'] = '0';
                //$scope.newSamples['LS']['Value'] = '0';
                //$scope.newSamples['OO']['Value'] = '0';
                //$scope.newSamples['CL']['Value'] = '0';
                //$scope.newSamples['GD']['Value'] = '7';
                //$scope.newSamples['TB']['Value'] = '4';
                //$scope.newSamples['FS']['Value'] = '0';

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
                angular.forEach($scope.newSamples, function (value, index) {
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
                $log.log('iwl metrics');
                $log.log($scope.iwlMetrics);
            }
        }

        $scope.setVariables = function () {
            $scope.newEvent = {};
            $scope.newSamples = {};
            $scope.newCondition = {};
            $scope.depths = {};
            $scope.monitors = {};
            

        }


        $scope.setupConditionDropdowns = function () {
            angular.forEach($scope.conditions, function (value, key) {
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
                    $scope.newEvent.StationId = $scope.stationsList[1].value;
                    $scope.noStations = '';
                } else {
                    $scope.noStations = 'There are no stations for this group.';
                }
            });

        }

        $scope.populateParameterFormElements = function (grpId) {            
            return (new groupService()).$getById({ key: grpId })
            .then(function (data) {
                $scope.parameters = [];
                if (data.BenthicMethod !== null) {
                    $scope.benthicParametersError = false;
                    $scope.benthicMethod = data.BenthicMethod;
                    $scope.orderByMethod = function (prm) {
                        var order = 0;
                        if ($scope.benthicMethod == 'allarm') {
                            order = prm['allarmOrder'];
                        } else {
                            order = prm['iwlOrder'];
                        }
                        return order;
                    }
                    return (new benthicParameterService()).$getByBenthicMethod({ benthicMethod: data.BenthicMethod })
                    .then(function (data) {
                        $log.log('parameters');
                        $log.log($scope.parameters);
                        angular.forEach(data.value, function (value, key) {
                            $scope.parameters.push(value);
                        });
                        if ($scope.parameters.length > 0) {
                            angular.forEach($scope.parameters, function (value, key) {
                                $scope.newSamples[value.Code] = {};
                                $scope.newSamples[value.Code]['Value'] = null;
                                $scope.newSamples[value.Code]['ParameterBenthicId'] = value.Id;
                                $scope.newSamples[value.Code]['allarmGroup'] = value.allarmGroup;
                                $scope.newSamples[value.Code]['iwlRockyGroup'] = value.iwlRockyGroup;
                                $scope.newSamples[value.Code]['iwlMuddyGroup'] = value.iwlMuddyGroup;
                                $scope.newSamples[value.Code]['tolerant'] = value.tolerant;
                                $scope.newSamples[value.Code]['nonInsects'] = value.nonInsects;
                                
                            });
                            $scope.noParameters = '';
                           
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
            //var addEvent = $scope.newEvent;
            if (form.$valid) {
                angular.forEach($scope.newSamples, function (value, index) {                    
                    if (
                        (typeof $scope.newSamples[index]['Value'] == 'undefined' | $scope.newSamples[index]['Value'] == ''|$scope.newSamples[index]['Value']==null) ){
                        delete $scope.newSamples[index];
                    }
                });

                var keys = Object.keys($scope.newSamples);
                var len = keys.length;
                if (len > 0) {
                    var SampleDate = new Date($scope.newEvent.SampleDate)
                    SampleDate = SampleDate.getFullYear() + '-' + ("0" + (SampleDate.getMonth() + 1)).slice(-2) + "-" + ("0" + SampleDate.getDate()).slice(-2)

                    var SampleTime = $scope.newEvent.SampleTime
                    SampleTime = moment(SampleTime, "h:mm a").format('HH:mm:ss');

                    var SampleDateTime = SampleDate + 'T' + SampleTime + 'Z';
                    

                    notificationFactory.success('Adding New Samples.', 'Adding Samples', { timeOut: 0, extendedTimeOut: 0 });

                    var DateTimeNow = new Date().toJSON();
                    var addEvent = {
                        "DateTime": SampleDateTime,
                        "StationId": $scope.newEvent.StationId,
                        "GroupId": $scope.slctGroupId,
                        "CreatedDate": DateTimeNow,
                        "CreatedBy": userId,
                        "ModifiedDate": DateTimeNow,
                        "ModifiedBy": userId,
                        "Comments": $scope.newEvent.Comments
                    }
                    //$scope.newEvent = {};
                    //$scope.newSamples = {};
                    

                    return (new benthicEventService(addEvent)).$save()
                    .then(function (data) {
                        //$scope.newEvent = {};
                        var eventId = data.Id;
                        var batchRequest = [];
                        var countBatch = 0;
                        var size = $scope.conditions.length;
                        angular.forEach($scope.conditions, function (value, key) {                            
                            if (typeof value.Value != 'undefined' & value.Value != '' & value.Value != null & !($scope.benthicMethod=='allarm' & value.Id == 79)) {
                                var addCondition = {
                                    "BenthicEventId": eventId,
                                    "BenthicConditionId": value.Id,
                                    "Value": value.Value
                                }
                                batchRequest.push({ requestUri: "BenthicEventConditions", method: "POST", data: addCondition });
                                countBatch += 1;
                            }
                            if (key == (size - 1)|countBatch==90) {
                                oData.request({
                                    requestUri: "/odata/$batch",
                                    method: "POST",
                                    data: {
                                        __batchRequests: batchRequest
                                    }
                                }, function (data, response) {

                                }, undefined, window.odatajs.oData.batch.batchHandler);
                                if (countBatch == 90) {
                                    countBatch = 0;
                                    batchRequest = [];
                                }
                            }
                        });


                        batchRequest = [];
                        countBatch = 0;

                        var keys = Object.keys($scope.monitors);
                        size = keys.length;
                        var cnt = 0;
                        $log.log('size');
                        $log.log(size);
                        if (size > 0) {
                            angular.forEach($scope.monitors, function (value, key) {
                                if (value.Id != null && value.Hours !== null) {

                                    var addMonitorEvent = {
                                        "BenthicEventId": eventId,
                                        "UserId": value.Id,
                                        "Hours": parseFloat(value.Hours),
                                        'CreatedDate': DateTimeNow,
                                        'CreatedBy': userId,
                                        'ModifiedDate': DateTimeNow,
                                        'ModifiedBy': userId
                                    }

                                    batchRequest.push({ requestUri: "BenthicMonitorLogs", method: "POST", data: addMonitorEvent });
                                    countBatch += 1;
                                }
                                if (batchRequest.length > 0) {
                                    cnt += 1;
                                    if (cnt == (size - 1) | countBatch == 90) {
                                        $log.log('got here');
                                        oData.request({
                                            requestUri: "/odata/$batch",
                                            method: "POST",
                                            data: {
                                                __batchRequests: batchRequest
                                            }
                                        }, function (data, response) {

                                        }, undefined, window.odatajs.oData.batch.batchHandler);
                                        if (countBatch == 90) {
                                            countBatch = 0;
                                            batchRequest = [];
                                        }
                                    }
                                }
                            });
                        }
                        batchRequest = [];
                        countBatch = 0;
                        size = len;
                        angular.forEach($scope.newSamples, function (value, key) {
                            var addSample = {
                                "BenthicEventId": eventId,
                                "BenthicParameterId": value['ParameterBenthicId'],
                                "Value": parseFloat(value['Value']),
                                "QaFlagId": 1,
                                "Comments": $scope.newEvent.Comments,
                                'CreatedDate' : DateTimeNow,
                                'CreatedBy' : userId,
                                'ModifiedDate' : DateTimeNow,
                                'ModifiedBy' : userId,
                            }

                            batchRequest.push({ requestUri: "BenthicSamples", method: "POST", data: addSample });
                            countBatch += 1;

                            if (countBatch == (size) | countBatch == 90) {
                                oData.request({
                                    requestUri: "/odata/$batch",
                                    method: "POST",
                                    data: {
                                        __batchRequests: batchRequest
                                    }
                                }, function (data, response) {
                                    
                                   
                                    notificationFactory.success('Samples added successfully', 'Samples Added!');
                                    var url = "https://" + $window.location.host + "/Admin/#/benthicSamplesAdmin/addConfirmation";
                                    $log.log(url);
                                    $window.location.href = url;
                                    
                                }, undefined, window.odatajs.oData.batch.batchHandler);
                                if (countBatch == 90) {
                                    countBatch = 0;
                                    batchRequest = [];
                                }
                            }
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
                $scope.prmSetIndex = 0;
                $scope.prmSetIndices = [];
                $scope.groupUsersList = [];
                $scope.monitors = {};
                $scope.parameters = [];
                $scope.prmSetIndices.push($scope.prmSetIndex);
                $scope.populateStationsDropdown(newValue);
                $scope.populateParameterFormElements(newValue);
                $scope.populateUserDropdowns(newValue);
                $scope.checkIfEventExists();
                //return (new userService()).$getUsersInGroup({ key: newValue }).then(function (data) {
                //    $scope.groupUsers = data.value;
                //    $log.log('get users');
                //    $log.log($scope.groupUsers);
                //    $scope.groupUsersList = [{
                //        "name": "",
                //        "value": null
                //    }];
                //    angular.forEach($scope.groupUsers, function (value, key) {
                //        $scope.groupUsersList.push(
                //            {
                //                value: value.Id,
                //                name: value.FirstName + ' ' + value.LastName
                //            }
                //          );
                //    });
                //    $log.log($scope.groupUsersList);
                //    angular.forEach([0, 1, 2], function (value, index) {
                //        $log.log('values');
                //        $log.log($scope.groupUsersList[0].value);
                //        $scope.monitors[value] = {};
                //        $scope.monitors[value]['Id'] = $scope.groupUsersList[0].value;
                //        $scope.monitors[value]['Hours'] = null;
                //        //$scope.users[index].Id = $scope.groupUsersList[0].value;                    
                //    });
                //});
                
                
            }            
        });

        $scope.$watch('newEvent.StationId', function (newValue, oldValue) {
            $scope.checkIfEventExists();
        }, true);//add true here to watch for value equality rather than reference equality. important for watchin object property

        $scope.$watch('newEvent.SampleTime', function (newValue, oldValue) {
            $scope.checkIfEventExists();
        }, true);//add true here to watch for value equality rather than reference equality. important for watchin object property

        $scope.$watch('newEvent.SampleDate', function (newValue, oldValue) {
            $scope.checkIfEventExists();
        }, true);//add true here to watch for value equality rather than reference equality. important for watchin object property


        $scope.checkIfEventExists = function () {

            if ($scope.newEvent.SampleTime !== null && $scope.newEvent.SampleDate !== null && $scope.slctGroupId !== null && $scope.newEvent.StationId !== null &&
            typeof $scope.newEvent.SampleTime !== 'undefined' && typeof $scope.newEvent.SampleDate !== 'undefined' &&
            typeof $scope.slctGroupId !== 'undefined' && typeof $scope.newEvent.StationId !== 'undefined') {

                var SampleDate = new Date($scope.newEvent.SampleDate);
                SampleDate = SampleDate.getFullYear() + '-' + ("0" + (SampleDate.getMonth() + 1)).slice(-2) + "-" + ("0" + SampleDate.getDate()).slice(-2);
                var SampleTime = $scope.newEvent.SampleTime;

                SampleTime = moment(SampleTime, "h:mm a").format('HH:mm:ss');

                var SampleDateTime = SampleDate + 'T' + SampleTime + 'Z';

                return (new benthicEventService()).$getByGroupStationAndDateTime({ dateTime: SampleDateTime, stationId: $scope.newEvent.StationId, groupId: $scope.slctGroupId })
                .then(function (data) {
                    if (data.value.length > 0) {
                        $scope.addSampleForm.SampleTime.$setValidity('eventExistsError', false)
                        $scope.addSampleForm.SampleDate.$setValidity('eventExistsError', false)
                        $scope.addSampleForm.Group.$setValidity('eventExistsError', false)
                        $scope.addSampleForm.Station.$setValidity('eventExistsError', false)
                    } else {
                        $scope.addSampleForm.SampleTime.$setValidity('eventExistsError', true)
                        $scope.addSampleForm.SampleDate.$setValidity('eventExistsError', true)
                        $scope.addSampleForm.Group.$setValidity('eventExistsError', true)
                        $scope.addSampleForm.Station.$setValidity('eventExistsError', true)

                    }
                })
            }
        }

    };
    benthicSamplesAddController.$inject = ['$scope', '$filter', '$log', '$q', '$anchorScroll', 'stationGroupService',
                                            'benthicParameterService',
                                            'benthicEventService', 'benthicSampleService',
                                            'userGroup', 'userGroupId', 'userRole', 'userId', 'userName', 'userGroupId',
                                            'qualifierService', 'problemService', 'conditionService',
                                            'eventConditionService', 'groupService', 'benthicEventConditionService',
                                            'benthicConditionService', 'benthicConditionCategoriesService', 'userService', 'benthicMonitorLogService',
                                            'notificationFactory', 'stationService', 'oData',
                                            'leafletMapEvents', 'leafletData', '$timeout','$window'];
    app.controller("benthicSamplesAddController", benthicSamplesAddController);
}(angular.module("cmcApp")));