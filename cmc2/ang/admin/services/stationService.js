(function (app) {
    var stationService = function ($resource, stationApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: stationApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: stationApiUrl + "(:key)" },
            'getByGroupId': { method: "GET", params: { key: "@key" }, url: stationApiUrl + "?$filter=GroupId eq " + '(:key) and Status eq 1' },
            'getByName': { method: "GET", params: { key: "@key" }, url: stationApiUrl + "?$filter=Name eq " + "':key'" },
            'getByStationCode': { method: "GET", params: { key: "@key" }, url: stationApiUrl + "?$filter=Code eq " + "':key'" },
            'getByStationCodeStartsWith': { method: "GET", params: { key: "@key" }, url: stationApiUrl + "?$filter=startswith(Code," + "':key'" + ")&$orderby=Code desc" },
            'save': { method: "POST", url: stationApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: stationApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: stationApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: stationApiUrl + "(:key)" }
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
}(angular.module("cmcApp")));