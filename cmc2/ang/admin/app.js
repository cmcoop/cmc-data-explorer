   /// <reference path="C:\Users\parrishd\Documents\projects\cmc2\cmc2\Views/GroupsAdmin/list.html" />
(function () {
    
    var app = angular.module('cmcApp', ['ui-leaflet','angularUtils.directives.dirPagination',
        'jcs.angular-http-batch', 'ui.router', "ngResource", 'ngMessages', 'moment-picker', 
        'ngFileUpload', 'ui.grid', 'ui.grid.edit', 'ui.grid.selection', 'ui.grid.exporter',
        'ui.grid.resizeColumns', 'chart.js', 'ngSanitize', 'ngCsv']);//ngRoute

    app.config(function ($stateProvider, $urlRouterProvider,$injector) {

        $urlRouterProvider.otherwise('/index');
        var cacheBustSuffix = Date.now();


        $stateProvider
            // HOME STATES AND NESTED VIEWS ========================================
            .state('index', {
                url: '/index',
                templateUrl: "/ang/admin/views/index.html"+ '?cache-bust=' + cacheBustSuffix,
                controller: "indexController"
            })
            .state('usersAdmin', {
                url: '/usersAdmin/list',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/usersAdmin/list.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "usersController"
                    }
                    //,
                    //'edit@usersAdmin': {
                    //    templateUrl: "/UsersAdmin/Edit"
                    //}
                },

            })
            .state('usersAdminBulk', {
                url: '/usersAdmin/addBulk',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/usersAdmin/addBulk.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "usersAddBulkController"
                    }
                }
            })
            .state('groupsAdmin', {
                url: '/groupsAdmin/list',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/groupsAdmin/list.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "groupsController"
                    },
                    'edit@groupsAdmin': {
                        templateUrl: "/ang/admin/views/groupsAdmin/edit.html" + '?cache-bust=' + cacheBustSuffix
                    },
                    'add@groupsAdmin': {
                        templateUrl: "/ang/admin/views/groupsAdmin/add.html" + '?cache-bust=' + cacheBustSuffix
                    },
                    'selectParameters@groupsAdmin': {
                        templateUrl: "/ang/admin/views/groupsAdmin/selectParameters.html"+ '?cache-bust=' + cacheBustSuffix
                    }
                },

            })
            .state('labsAdmin', {
                url: '/labsAdmin/list',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/labsAdmin/list.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "labsController"
                    },
                    'edit@labsAdmin': {
                        templateUrl: "/ang/admin/views/labsAdmin/edit.html" + '?cache-bust=' + cacheBustSuffix
                    },
                    'add@labsAdmin': {
                        templateUrl: "/ang/admin/views/labsAdmin/add.html" + '?cache-bust=' + cacheBustSuffix
                    }
                }

            })
             .state('conditionsAdmin', {
                 url: '/conditionsAdmin/list' + '?cache-bust=' + cacheBustSuffix,
                 views: {
                     '': {
                         templateUrl: "/ang/admin/views/conditionsAdmin/list.html"+ '?cache-bust=' + cacheBustSuffix,
                         controller: "conditionsController"
                     },
                     'edit@conditionsAdmin': {
                         templateUrl: "/ang/admin/views/conditionsAdmin/edit.html" + '?cache-bust=' + cacheBustSuffix
                     },
                     'add@conditionsAdmin': {
                         templateUrl: "/ang/admin/views/conditionsAdmin/add.html" + '?cache-bust=' + cacheBustSuffix
                     }
                 }

             })
            .state('parametersAdmin', {
                url: '/parametersAdmin/list',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/parametersAdmin/list.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "parametersController"
                    },
                    'edit@parametersAdmin': {
                        templateUrl: "/ang/admin/views/parametersAdmin/edit.html" + '?cache-bust=' + cacheBustSuffix
                    },
                    'add@parametersAdmin': {
                        templateUrl: "/ang/admin/views/parametersAdmin/add.html" + '?cache-bust=' + cacheBustSuffix
                    }
                }
            })
            .state('calibrationParametersAdmin', {
                url: '/calibrationParametersAdmin/list',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/calibrationParametersAdmin/list.html"+ '?cache-bust=' + cacheBustSuffix,
                        controller: "calibrationParametersController"
                    },
                    'edit@calibrationParametersAdmin': {
                        templateUrl: "/ang/admin/views/calibrationParametersAdmin/edit.html" + '?cache-bust=' + cacheBustSuffix
                    },
                    'add@calibrationParametersAdmin': {
                        templateUrl: "/ang/admin/views/calibrationParametersAdmin/add.html" + '?cache-bust=' + cacheBustSuffix
                    }
                }
            })
            
            .state('stationsAdminBulk', {
                url: '/stationsAdmin/addBulk',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/stationsAdmin/addBulk.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "stationsAddBulkController"
                    }
                }
            })
            .state('stationsSubmit', {
                url: '/stationsSubmit/add',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/stationsSubmit/add.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "stationsSubmitController"
                    }
                }
            })
            .state('samplesAdmin', {
                url: '/samplesAdmin/index',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/samplesAdmin/uploadType.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "samplesUploadTypeController"
                    }               
                }
            })
            .state('stationsAdmin', {
                url: '/stationsAdmin/list',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/stationsAdmin/list.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "stationsController"
                    },
                    'edit@stationsAdmin': {
                        templateUrl: "/ang/admin/views/stationsAdmin/edit.html" + '?cache-bust=' + cacheBustSuffix
                    },
                    'add@stationsAdmin': {
                        templateUrl: "/ang/admin/views/stationsAdmin/add.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "stationsAddController"
                    }
                },
            })
            .state('samplesAdminAdd', {
                url: '/samplesAdmin/add',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/samplesAdmin/add.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "samplesAddController"
                    },
                    'warnings@samplesAdminAdd': {
                        templateUrl: "/ang/admin/views/samplesAdmin/warnings.html" + '?cache-bust=' + cacheBustSuffix
                    }
                }
            })
            .state('samplesAddConfirmation',{
                url: '/samplesAdmin/addConfirmation',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/samplesAdmin/addConfirmation.html" + '?cache-bust=' + cacheBustSuffix,

                    }
                }
            })
            .state('samplesEditConfirmation', {
                url: '/samplesAdmin/editConfirmation',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/samplesAdmin/editConfirmation.html" + '?cache-bust=' + cacheBustSuffix,

                    }
                }
            })
            .state('samplesAdminEdit', {
                url: '/samplesAdmin/list',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/samplesAdmin/list.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "samplesEditController"
                    },
                    'warnings@samplesAdminEdit': {
                        templateUrl: "/ang/admin/views/samplesAdmin/warnings.html" + '?cache-bust=' + cacheBustSuffix
                    },
                    'warningsPublished@samplesAdminEdit': {
                        templateUrl: "/ang/admin/views/samplesAdmin/warningsPublished.html" + '?cache-bust=' + cacheBustSuffix
                    },
                }
            })
            .state('samplesAdminEditReview', {
                url: '/samplesAdmin/edit',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/samplesAdmin/edit.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "samplesEditReviewController"
                    }
                }
            })
            .state('samplesAdminBulk', {
                url: '/samplesAdmin/addBulk',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/samplesAdmin/addBulk.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "samplesAddBulkController"
                    }
                }
            })
            .state('benthicSamplesAdminAdd', {
                url: '/benthicSamplesAdmin/add',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/benthicSamplesAdmin/add.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "benthicSamplesAddController"
                    }
                }
            })
             .state('benthicSamplesAdminAddConfirmation', {
                 url: '/benthicSamplesAdmin/addConfirmation',
                 views: {
                     '': {
                         templateUrl: "/ang/admin/views/benthicSamplesAdmin/addConfirmation.html" + '?cache-bust=' + cacheBustSuffix,

                     }
                 }
             })
            .state('benthicSamplesAdminBulk', {
                url: '/benthicSamplesAdmin/addBulk',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/benthicSamplesAdmin/addBulk.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "benthicSamplesAddBulkController"
                    }
                }
            })
            
            .state('benthicSamplesAdminEdit', {
                url: '/benthicSamplesAdmin/edit',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/benthicSamplesAdmin/edit.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "benthicSamplesEditController"
                    }
                }
            })
            .state('benthicSamplesAdmin', {
                url: '/benthicSamplesAdmin/index',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/benthicSamplesAdmin/uploadType.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "benthicSamplesUploadTypeController"
                    }
                }
            })
            .state('submissions', {
                url: '/submissions/list',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/submissions/list.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "submissionsController"
                    }
                }
            })
            .state('downloadTool', {
                url: '/downloadTool/download',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/downloadTool/download.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "downloadToolController"
                    }
                }
            })
            .state('testApi', {
                url: '/testApi/test',
                views: {
                    '': {
                        templateUrl: "/ang/admin/views/testApi/test.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "testApiController"
                    }
                }
            });

    });

    app.directive('groupunique', function (groupnameservice) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$asyncValidators.groupunique = groupnameservice;
            }
        };
    });

    app.factory('groupnameservice', function ($q, $http) {
        return function (Name) {
            var deferred = $q.defer();            
            $http.get("/odata/Groups?$filter=Name eq " + "'" + Name +"'").then(function(data) {                              
                if (data.data.value.length > 0) {                    
                    deferred.reject();
                } else {
                    deferred.resolve();
                }
            });            
            return deferred.promise;
        }
    });

    app.directive('selectpicker', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                array: '=',
                model: '=',
                class: '='
            },
            template: '<select class="selectpicker" ng-model="model" ng-options="o.value as o.name for o in array"'+
                        'data-size="5" data-width="100%" data-live-search="true"></select>',
            replace: true,
            link: function postLink(scope, element, attrs) {
                //$timeout(function () {
                $timeout(function () {
                $(element).selectpicker();
                //$(element).selectpicker('refresh');
                scope.$watch("model", function () {
                    $(element).selectpicker('refresh');
                });
                 }, 0)
                // }, 0)
            }
        }
    });

    app.directive('selectpickersmall', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                array: '=',
                model: '=',
                class: '='
            },
            template: '<select data-style="btn-info btn-sm" class="selectpicker" ng-model="model" ng-options="o.value as o.name for o in array"' +
                        'data-size="5" data-width="100%" data-live-search="true"></select>',
            replace: true,
            link: function postLink(scope, element, attrs) {
                $timeout(function () {
                    $timeout(function () {
                        $(element).selectpicker();
                        $(element).selectpicker('refresh');
                        scope.$watch("model", function () {
                            $(element).selectpicker('refresh');
                        });
                    }, 0)
                }, 0)
            }
        }
    });

    app.directive('selectpickermulti', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                array: '=',
                model: '=',
                class: '='
            },
            template: '<select class="selectpicker" ng-model="model" ng-options="o.value as o.name for o in array"' +
                        'data-size="5" multiple data-width="100%" data-live-search="true"></select>',
            replace: true,
            link: function postLink(scope, element, attrs) {
                $timeout(function () {
                    $timeout(function () {
                        $(element).selectpicker();
                        $(element).selectpicker('refresh');
                        scope.$watch("model", function () {
                            $(element).selectpicker('refresh');
                        });
                    }, 0)
                }, 0)
            }
        }
    });

    app.directive('selectpickermulti3', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                array: '=',
                model: '=',
                class: '='
            },
            template: '<select class="selectpicker3" ng-model="model" ng-options="o.value as o.name for o in array"' +
                        'data-size="5" data-max-options="3" multiple data-width="100%" data-live-search="true"></select>',
            replace: true,
            link: function postLink(scope, element, attrs) {
                $timeout(function () {
                    $timeout(function () {
                        $(element).selectpicker();
                        $(element).selectpicker('refresh');
                        scope.$watch("model", function () {
                            $(element).selectpicker('refresh');
                        });
                    }, 0)
                }, 0)
            }
        }
    });

    app.config(['momentPickerProvider', function (momentPickerProvider) {
        momentPickerProvider.options({
            hoursFormat:'h:mm A',
            minutesFormat: 'hh:mm',
            minutesStep: 1
        });
    }]);

    app.filter('griddropdown', function () {
        return function (input, context) {
            //For some reason the text "this" is occasionally directly being
            //passed here
            if (typeof context === 'undefined' || context === 'this')
                return 0;

            //Workaround for bug in ui-grid
            if (typeof context.col === 'undefined') {
                var sortCols = context.grid.getColumnSorting();
                if (sortCols.length <= 0)
                    return 0;

                context = { col: sortCols[0], row: context };
            }

            var map = context.col.colDef.editDropdownOptionsArray;
            var idField = context.col.colDef.editDropdownIdLabel;
            var valueField = context.col.colDef.editDropdownValueLabel;
            var initial = context.row.entity[context.col.field];
            if (typeof map !== "undefined") {
                for (var i = 0; i < map.length; i++) {
                    if (map[i][idField] == input) {
                        return map[i][valueField];
                    }
                }
            } else if (initial) {
                return initial;
            }
            return input;
        };
    });

    

    app.filter('orderObjectBy', function () {
        return function (input, attribute) {
            if (!angular.isObject(input)) return input;

            var array = [];
            for (var objectKey in input) {
                array.push(input[objectKey]);
            }

            array.sort(function (a, b) {
                a = parseInt(a[attribute]);
                b = parseInt(b[attribute]);
                return b-a;
            });
            return array;
        }
    });

    

    app.constant("benthicEventApiUrl", "/odata/BenthicEvents");
    app.constant("benthicParameterApiUrl", "/odata/BenthicParameters");
    app.constant("benthicSampleApiUrl", "/odata/BenthicSamples");
    app.constant("benthicConditionApiUrl", "/odata/BenthicConditions");
    app.constant("benthicEventConditionApiUrl", "/odata/BenthicEventConditions");
    app.constant("benthicConditionCategoriesApiUrl", "/odata/BenthicConditionCategories");
    app.constant("benthicMonitorLogApiUrl", "/odata/BenthicMonitorLogs");
    app.constant("groupApiUrl", "/odata/Groups");
    app.constant("eventApiUrl", "/odata/Events");
    app.constant("sampleApiUrl", "/odata/Samples");
    app.constant("parameterApiUrl", "/odata/Parameters");
    app.constant("relatedParameterApiUrl", "/odata/RelatedParameters");
    app.constant("parameterGroupApiUrl", "/odata/ParameterGroups");
    app.constant("stationGroupApiUrl", "/odata/StationGroups");
    app.constant("stationApiUrl", "/odata/Stations");
    app.constant("problemApiUrl", "/odata/Problems");
    app.constant("qualifierApiUrl", "/odata/Qualifiers");
    app.constant("qaFlagApiUrl", "/odata/QaFlags");
    app.constant("stationSamplingMethodApiUrl", "/odata/StationSamplingMethods");
    app.constant("userApiUrl", "/odata/ApplicationUsers");
    app.constant("labApiUrl", "/odata/Labs");
    app.constant("eventConditionApiUrl", "/odata/EventConditions");
    app.constant("conditionApiUrl", "/odata/Conditions");
    app.constant("monitorLogApiUrl", "/odata/MonitorLogs");
    app.constant("conditionCategoriesApiUrl", "/odata/ConditionCategories");
    app.constant("oData", window.odatajs.oData);

    
    
}());