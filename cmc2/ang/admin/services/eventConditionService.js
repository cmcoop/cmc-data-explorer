(function (app) {
    var eventConditionService = function ($resource, eventConditionApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: eventConditionApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: eventConditionApiUrl + "(:key)" },
            'getByEventId': { method: "GET", params: { key: "@key" }, url: eventConditionApiUrl + "?$filter=EventId eq " + '(:key)' },
            'getByStationId': { method: "GET", params: { key: "@key" }, url: eventConditionApiUrl + "?$filter=StationId eq " + '(:key)' },
            'save': { method: "POST", url: eventConditionApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: eventConditionApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: eventConditionApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: eventConditionApiUrl + "(:key)" }
        })
    };
    eventConditionService.$inject = ['$resource', 'eventConditionApiUrl'];
    app.factory("eventConditionService", eventConditionService).factory('notificationFactory', function () {
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