(function (app) {
    var qualifierService = function ($resource, qualifierApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: qualifierApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: qualifierApiUrl + "(:key)" },
            'save': { method: "POST", url: qualifierApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: qualifierApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: qualifierApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: qualifierApiUrl + "(:key)" }
        })
    };
    qualifierService.$inject = ['$resource', 'qualifierApiUrl'];
    app.factory("qualifierService", qualifierService).factory('notificationFactory', function () {
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