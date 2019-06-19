(function (app) {
    var monitorLogService = function ($resource, monitorLogApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: monitorLogApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: monitorLogApiUrl + "(:key)" },
            'getByEventId': { method: "GET", params: { key: "@key" }, url: monitorLogApiUrl + "?$filter=EventId eq " + '(:key)' },
            'getByEventIdAndUserId': {
                method: "GET", params: { stationId: "@eventId", userId: "@userId" }, url: monitorLogApiUrl + "?$filter=EventId eq " +
                    "(:eventId) and UserId eq " + "(':userId')"
            },
            'save': { method: "POST", url: monitorLogApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: monitorLogApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: monitorLogApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: monitorLogApiUrl + "(:key)" }
        })
    };
    monitorLogService.$inject = ['$resource', 'monitorLogApiUrl'];
    app.factory("monitorLogService", monitorLogService).factory('notificationFactory', function () {
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