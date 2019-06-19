(function (app) {
    var stationService = function ($resource, stationApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: stationApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: stationApiUrl + "(:key)" },
            'getByGroupId': { method: "GET", params: { key: "@key" }, url: stationApiUrl + "?$filter=GroupId eq " + '(:key)' },
            'getStationRichness': { method: "GET", url: '/odata/GetStationRichness' }
        })
    };
    stationService.$inject = ['$resource', 'stationApiUrl'];
    app.factory("stationService", stationService).factory('notificationFactory', function () {
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