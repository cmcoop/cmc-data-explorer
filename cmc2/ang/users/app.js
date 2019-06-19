   
(function () {
    
    var app = angular.module('cmcUsers', ['ui-leaflet','angularUtils.directives.dirPagination',
        'jcs.angular-http-batch', 'ui.router', "ngResource", 'ngMessages','moment-picker','ngCsv']);//ngRoute

    app.config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/index');

        $stateProvider
            // HOME STATES AND NESTED VIEWS ========================================
            .state('index', {
                url: '/index',
                templateUrl: "/ang/public/views/index.html",
                controller: "indexController"
            })
            
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
    app.constant("parameterGroupApiUrl", "/odata/ParameterGroups");
    app.constant("stationApiUrl", "/odata/Stations");
    app.constant("problemApiUrl", "/odata/Problems");
    app.constant("qualifierApiUrl", "/odata/Qualifiers");
    app.constant("userApiUrl", "/odata/ApplicationUsers");
    app.constant("oData", window.odatajs.oData);

    
    
}());