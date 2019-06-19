(function (app) {
    var stationGroupService = function ($resource, stationGroupApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: stationGroupApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: stationGroupApiUrl + "(:key)" },
            'getByGroupId': { method: "GET", params: { key: "@key" }, url: stationGroupApiUrl + "?$filter=GroupId eq " + '(:key)' },
            'getByStationId': { method: "GET", params: { key: "@key" }, url: stationGroupApiUrl + "?$filter=StationId eq " + '(:key)' },
            'getByStationIdAndGroupId': { method: "GET", params: { stationId: "@stationId",groupId: "@groupId" }, url: stationGroupApiUrl + "?$filter=StationId eq " + '(:stationId)' + 'and GroupId eq ' + '(:groupId)' },
            'getStationsByGroupId': { method: "GET", params: { key: "@key" }, url: stationGroupApiUrl + "?$filter=GroupId eq " + '(:key) ' + '&$expand=Station' + '&$select=Station' + '&$orderby=Station/Name' },
            'expandAll': { method: "GET", url: stationGroupApiUrl + '?$expand=Station,Group' },
            'expandAllByStationId': { method: "GET", url: stationGroupApiUrl + '?$filter=StationId eq ' + '(:key)' + '&$expand=Station,Group' }            
        })
    };
    stationGroupService.$inject = ['$resource', 'stationGroupApiUrl'];
    app.factory("stationGroupService", stationGroupService).factory('notificationFactory', function () {
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