(function (app) {
    var benthicSampleService = function ($resource, benthicSampleApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: benthicSampleApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: benthicSampleApiUrl + "&$filter= Id eq :key" },
            
            'getByStationId':{
                method: "GET", params: { stationId: "@stationId" },
                url: benthicSampleApiUrl + '?$expand=BenthicParameter,BenthicEvent($expand=Station,Group,BenthicEventConditions($expand=BenthicCondition))&$filter=BenthicEvent/StationId eq :stationId and  QaFlagId eq 2'
            },
           
        })
    };
    benthicSampleService.$inject = ['$resource', 'benthicSampleApiUrl'];
    app.factory("benthicSampleService", benthicSampleService).factory('notificationFactory', function () {
        return {
            success: function (text, title, options) {
                toastr.clear();
                toastr.success(text, title, options);
            },
            error: function (text) {
                toastr.error(text, "Error");
            }
        };
    });
}(angular.module("cmcPublic")));