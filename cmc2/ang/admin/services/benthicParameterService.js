(function (app) {
    var benthicParameterService = function ($resource, benthicParameterApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: benthicParameterApiUrl },
            'getByBenthicMethod': {
                method: "GET", params: { benthicMethod: "@benthicMethod" },
                url: benthicParameterApiUrl + "?$filter=Method eq ':benthicMethod' or Method eq 'both'"
            },
            'getById': { method: "GET", params: { key: "@key" }, url: benthicParameterApiUrl + "(:key)" },            
            'save': { method: "POST", url: benthicParameterApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: benthicParameterApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: benthicParameterApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: benthicParameterApiUrl + "(:key)" }
        })
    };
    benthicParameterService.$inject = ['$resource', 'benthicParameterApiUrl'];
    app.factory("benthicParameterService", benthicParameterService).factory('notificationFactory', function () {
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