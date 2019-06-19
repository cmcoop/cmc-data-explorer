(function (app) {
    var benthicMonitorLogService = function ($resource, benthicMonitorLogApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: benthicMonitorLogApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: benthicMonitorLogApiUrl + "(:key)" },
            'getByEventId': { method: "GET", params: { key: "@key" }, url: benthicMonitorLogApiUrl + "?$filter=BenthicEventId eq " + '(:key)&$expand=ApplicationUser' },
            'save': { method: "POST", url: benthicMonitorLogApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: benthicMonitorLogApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: benthicMonitorLogApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: benthicMonitorLogApiUrl + "(:key)" }
        })
    };
    benthicMonitorLogService.$inject = ['$resource', 'benthicMonitorLogApiUrl'];
    app.factory("benthicMonitorLogService", benthicMonitorLogService).factory('notificationFactory', function () {
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