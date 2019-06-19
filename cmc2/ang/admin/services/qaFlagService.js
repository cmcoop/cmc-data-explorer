(function (app) {
    var qaFlagService = function ($resource, qaFlagApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: qaFlagApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: qaFlagApiUrl + "(:key)" },
            'save': { method: "POST", url: qaFlagApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: qaFlagApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: qaFlagApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: qaFlagApiUrl + "(:key)" }
        })
    };
    qaFlagService.$inject = ['$resource', 'qaFlagApiUrl'];
    app.factory("qaFlagService", qaFlagService).factory('notificationFactory', function () {
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