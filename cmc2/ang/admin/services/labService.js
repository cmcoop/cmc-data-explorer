(function (app) {
    var labService = function ($resource, labApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: labApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: labApiUrl + "(:key)" },            
            'save': { method: "POST", url: labApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: labApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: labApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: labApiUrl + "(:key)" }
        })
    };
    labService.$inject = ['$resource', 'labApiUrl'];
    app.factory("labService", labService).factory('notificationFactory', function () {
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