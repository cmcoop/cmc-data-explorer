(function (app) {
    var conditionCategoriesService = function ($resource, conditionCategoriesApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: conditionCategoriesApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: conditionCategoriesApiUrl + "(:key)" },
            'getByCategoryId': { method: "GET", params: { key: "@key" }, url: conditionCategoriesApiUrl + "?$filter=ConditionId eq " + '(:key)&$orderby=Order' },
            'save': { method: "POST", url: conditionCategoriesApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: conditionCategoriesApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: conditionCategoriesApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: conditionCategoriesApiUrl + "(:key)" }
        })
    };
    conditionCategoriesService.$inject = ['$resource', 'conditionCategoriesApiUrl'];
    app.factory("conditionCategoriesService", conditionCategoriesService).factory('notificationFactory', function () {
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