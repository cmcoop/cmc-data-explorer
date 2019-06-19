(function (app) {
    var parameterService = function ($resource, parameterApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: parameterApiUrl },
            'getAllCalibration': { method: "GET", url: parameterApiUrl + "?$filter=isCalibrationParameter eq true" },
            'getAllWaterQuality': { method: "GET", url: parameterApiUrl + "?$filter=isCalibrationParameter eq false" },
            'getAllWithSampleDepth': { method: "GET", url: parameterApiUrl + "?$filter=requiresSampleDepth eq true"},
            'getAllWithoutSampleDepth': { method: "GET", url: parameterApiUrl + "?$filter=requiresSampleDepth eq false" },
            'getById': { method: "GET", params: { key: "@key" }, url: parameterApiUrl + "(:key)" },            
            'save': { method: "POST", url: parameterApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: parameterApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: parameterApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: parameterApiUrl + "(:key)" }
        })
    };
    parameterService.$inject = ['$resource', 'parameterApiUrl'];
    app.factory("parameterService", parameterService).factory('notificationFactory', function () {
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