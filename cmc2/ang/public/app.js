   
(function () {
    
    var app = angular.module('cmcPublic', ['ui-leaflet','angularUtils.directives.dirPagination',
        'jcs.angular-http-batch', 'ui.router', "ngResource", 'ngMessages', 'moment-picker', 'chart.js', 'nvd3',
        'ngD3ToImage', 'ngFileSaver', 'ngCsv', 'ui.bootstrap']);//ngRoute

    app.config(function ($stateProvider, $urlRouterProvider, $injector) {

        $urlRouterProvider.otherwise('/home');
        var cacheBustSuffix = Date.now();

        $stateProvider
            // HOME STATES AND NESTED VIEWS ========================================
            //.state('index', {
            //    url: '/index',
            //    templateUrl: "/ang/public/views/index.html" + '?cache-bust=' + cacheBustSuffix,
            //    controller: "indexController"
            //})
            .state('home', {
                url: '/home',
                views:{
                    '': {
                        templateUrl: "/ang/public/views/home.html" + '?cache-bust=' + cacheBustSuffix,
                        controller: "homeController"
                    }
                }
                
            })
            .state('home.query', {
                url: '/query/',
                views:{
                    'query':{
                        templateUrl: "/ang/public/views/query.html" + '?cache-bust=' + cacheBustSuffix,
                        
                        controller: "queryController"
                    }
                },
                params: {
                    stationId: null,
                    parameterId: null,
                    startDate: null,
                    endDate: null,
                    dataType: null
                }

            })
    });
    
    app.directive('selectpickersmall', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                array: '=',
                model: '=',
                class: '='
            },
            template: '<select data-style="btn-default btn-sm" class="selectpicker" ng-model="model" ng-options="o.value as o.name for o in array"' +
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
    app.directive('selectpicker', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                array: '=',
                model: '=',
                class: '='
            },
            template: '<select class="selectpicker" ng-model="model" ng-options="o.value as o.name for o in array"' +
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
    app.config(['momentPickerProvider', function (momentPickerProvider) {
        momentPickerProvider.options({
            hoursFormat: 'h:mm A',
            minutesFormat: 'hh:mm',
            minutesStep: 1
        });
    }]);
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
    

    
    app.constant("groupApiUrl", "/odata/Groups");
    app.constant("parameterApiUrl", "/odata/Parameters");
    app.constant("benthicParameterApiUrl", "/odata/BenthicParameters");
    app.constant("parameterGroupApiUrl", "/odata/ParameterGroups");
    app.constant("sampleApiUrl", "/odata/PublicSamples");
    app.constant("benthicSampleApiUrl", "/odata/PublicBenthicSamples");
    app.constant("stationApiUrl", "/odata/Stations");
    app.constant("stationGroupApiUrl", "/odata/StationGroups");
    app.constant("parameterGroupApiUrl", "/odata/ParameterGroups");
    app.constant("relatedParameterApiUrl", "/odata/RelatedParameter");
    app.constant("oData", window.odatajs.oData);

    
    
}());