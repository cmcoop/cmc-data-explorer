(function (app) {
    var sampleService = function ($resource, sampleApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: sampleApiUrl + '&$filter=Event/StationId eq :stationId and QaFlagId eq 2' },
            'getById': { method: "GET", params: { key: "@key" }, url: sampleApiUrl + "&$filter=Id eq :key" },
            
            'getByStationId':{
                method: "GET", params: { stationId: "@stationId" },
                url: sampleApiUrl + '?$expand=Event($expand=Station,Group),Parameter&$filter=Event/StationId eq :stationId  and QaFlagId eq 2'
            },
            
        })
    };
    sampleService.$inject = ['$resource', 'sampleApiUrl'];
    app.factory("sampleService", sampleService).factory('notificationFactory', function () {
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