(function (app) {
    var benthicConditionCategoriesService = function ($resource, benthicConditionCategoriesApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: benthicConditionCategoriesApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: benthicConditionCategoriesApiUrl + "(:key)" },
            'getByCategoryId': { method: "GET", params: { key: "@key" }, url: benthicConditionCategoriesApiUrl + "?$filter=ConditionId eq " + '(:key)&$orderby=Order' },
            'save': { method: "POST", url: benthicConditionCategoriesApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: benthicConditionCategoriesApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: benthicConditionCategoriesApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: benthicConditionCategoriesApiUrl + "(:key)" }
        })
    };
    benthicConditionCategoriesService.$inject = ['$resource', 'benthicConditionCategoriesApiUrl'];
    app.factory("benthicConditionCategoriesService", benthicConditionCategoriesService).factory('notificationFactory', function () {
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