(function (app) {
    var problemService = function ($resource, problemApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: problemApiUrl + "?$orderby=Order"},
            'getById': { method: "GET", params: { key: "@key" }, url: problemApiUrl + "(:key)" },
            'save': { method: "POST", url: problemApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: problemApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: problemApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: problemApiUrl + "(:key)" }
        })
    };
    problemService.$inject = ['$resource', 'problemApiUrl'];
    app.factory("problemService", problemService).factory('notificationFactory', function () {
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