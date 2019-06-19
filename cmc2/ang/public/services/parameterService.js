(function (app) {
    var parameterService = function ($resource, parameterApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: parameterApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: parameterApiUrl + "(:key)" },
            'getAllCalibration': { method: "GET", url: parameterApiUrl + "?$filter=isCalibrationParameter eq true" },
            'getAllWaterQuality': { method: "GET", url: parameterApiUrl + "?$filter=isCalibrationParameter eq false" },
            'getAllWithSampleDepth': { method: "GET", url: parameterApiUrl + "?$filter=requiresSampleDepth eq true"},
            'getAllWithoutSampleDepth': { method: "GET", url: parameterApiUrl + "?$filter=requiresSampleDepth eq false" }
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
}(angular.module("cmcPublic")));