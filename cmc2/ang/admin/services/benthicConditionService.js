(function (app) {
    var benthicConditionService = function ($resource, benthicConditionApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: benthicConditionApiUrl + "?$orderby=Order" },
            'getByBenthicMethod': {
                method: "GET", params: { benthicMethod: "@benthicMethod" },
                url: benthicConditionApiUrl + "?$filter=Method eq ':benthicMethod' or Method eq 'both'"
            },
            'getById': { method: "GET", params: { key: "@key" }, url: benthicConditionApiUrl + "(:key)"},            
            'save': { method: "POST", url: benthicConditionApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: benthicConditionApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: benthicConditionApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: benthicConditionApiUrl + "(:key)" }
        })
    };
    benthicConditionService.$inject = ['$resource', 'benthicConditionApiUrl'];
    app.factory("benthicConditionService", benthicConditionService).factory('notificationFactory', function () {
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