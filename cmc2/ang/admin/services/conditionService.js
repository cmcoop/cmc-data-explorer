(function (app) {
    var conditionService = function ($resource, conditionApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: conditionApiUrl +  "?$orderby=Order"},
            'getById': { method: "GET", params: { key: "@key" }, url: conditionApiUrl + "(:key)"},            
            'save': { method: "POST", url: conditionApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: conditionApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: conditionApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: conditionApiUrl + "(:key)" }
        })
    };
    conditionService.$inject = ['$resource', 'conditionApiUrl'];
    app.factory("conditionService", conditionService).factory('notificationFactory', function () {
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