(function (app) {
    var stationSamplingMethodService = function ($resource, stationSamplingMethodApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: stationSamplingMethodApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: stationSamplingMethodApiUrl + "(:key)" },
            'save': { method: "POST", url: stationSamplingMethodApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: stationSamplingMethodApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: stationSamplingMethodApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: stationSamplingMethodApiUrl + "(:key)" }
        })
    };
    stationSamplingMethodService.$inject = ['$resource', 'stationSamplingMethodApiUrl'];
    app.factory("stationSamplingMethodService", stationSamplingMethodService).factory('notificationFactory', function () {
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