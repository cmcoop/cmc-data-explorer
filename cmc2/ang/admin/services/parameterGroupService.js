(function (app) {
    var parameterGroupService = function ($resource, parameterGroupApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: parameterGroupApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: parameterGroupApiUrl + "(:key)" },
            'getByGroupId': { method: "GET", params: { key: "@key" }, url: parameterGroupApiUrl + "?$filter=GroupId eq " + '(:key)'},
            'save': { method: "POST", url: parameterGroupApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: parameterGroupApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: parameterGroupApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: parameterGroupApiUrl + "(:key)" }
        })
    };
    parameterGroupService.$inject = ['$resource', 'parameterGroupApiUrl']; 
    app.factory("parameterGroupService", parameterGroupService).factory('notificationFactory', function () {
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