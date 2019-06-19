(function (app) {
    var relatedParameterService = function ($resource, relatedParameterApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: relatedParameterApiUrl },            
            'getById': { method: "GET", params: { key: "@key" }, url: relatedParameterApiUrl + "(:key)" },
            'getByCalibrationId': { method: "GET", params: { key: "@key" }, url: relatedParameterApiUrl + "?$filter=CalibrationParameterId eq :key" },
            'getByWqParameterId': { method: "GET", params: { key: "@key" }, url: relatedParameterApiUrl + "?$filter=WqParameterId eq :key" },
            'getByWqParameterIdExpandCalibrationParameter': {
                method: "GET", params: { key: "@key" },
                url: relatedParameterApiUrl + "?$expand=CalibrationParameter,WqParameter&$filter=WqParameter/Id eq :key"
            },
            'getByCalibrationAndParameterId': { method: "GET", params: { wqParameterId: "@wqParameterId", calibrationParameterId:"@calibrationParameterId" }, 
                url: relatedParameterApiUrl + "?$filter=CalibrationParameterId eq :calibrationParameterId and WqParameterId eq :wqParameterId" },
            'save': { method: "POST", url: relatedParameterApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: relatedParameterApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: relatedParameterApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: relatedParameterApiUrl + "(:key)" }
        })
    };
    relatedParameterService.$inject = ['$resource', 'relatedParameterApiUrl'];
    app.factory("relatedParameterService", relatedParameterService).factory('notificationFactory', function () {
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