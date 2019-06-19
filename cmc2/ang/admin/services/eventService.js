(function (app) {
    var eventService = function ($resource, eventApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: eventApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: eventApiUrl + "(:key)" },
            'getByEventIdAndExpand': {
                method: "GET", params: { stationId: "@eventId" },
                url: eventApiUrl + '?$filter=Id eq :eventId&$expand=Station,Group'
            },
            'getByStationId': {
                method: "GET", params: { stationId: "@stationId" },
                url: eventApiUrl + '?$filter=StationId eq :stationId&$expand=Station,Group'
            },
            'getByStationAndDateTime': {
                method: "GET", params: { minDateTime: "@minDateTime", maxDateTime: "@maxDateTime", stationId: "@stationId" },
                url: eventApiUrl + '?$filter=DateTime gt :minDateTime and DateTime lt :maxDateTime and StationId eq :stationId'
            },
            'getByGroupStationAndDateTime': {
                method: "GET", params: { dateTime:"@dateTime", stationId: "@stationId", groupId: "@groupId" },
                url: eventApiUrl + '?$filter=DateTime eq :dateTime and StationId eq :stationId and GroupId eq :groupId'
            },
            'save': { method: "POST", url: eventApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: eventApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: eventApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: eventApiUrl + "(:key)" }
        })
    };
    eventService.$inject = ['$resource', 'eventApiUrl'];
    app.factory("eventService", eventService).factory('notificationFactory', function () {
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