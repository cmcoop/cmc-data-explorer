(function (app) {
    var benthicEventService = function ($resource, benthicEventApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: benthicEventApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: benthicEventApiUrl + "(:key)" },
            'getByStationId': {
                method: "GET", params: { stationId: "@stationId" },
                url: benthicEventApiUrl + '?$filter=StationId eq :stationId&$orderby=DateTime'
            },
            'getByGroupId': {
                method: "GET", params: { stationId: "@groupId" },
                url: benthicEventApiUrl + '?$filter=GroupId eq :groupId&$orderby=DateTime'
            },
            'getByStationAndDateTime': {
                method: "GET", params: { minDateTime: "@minDateTime", maxDateTime: "@maxDateTime", stationId: "@stationId" },
                url: benthicEventApiUrl + '?$filter=DateTime gt :minDateTime and DateTime lt :maxDateTime and StationId eq :stationId'
            },
            'getByGroupStationAndDateTime': {
                method: "GET", params: { dateTime: "@dateTime", stationId: "@stationId", groupId: "@groupId" },
                url: benthicEventApiUrl + '?$filter=DateTime eq :dateTime and StationId eq :stationId and GroupId eq :groupId'
            },

            'getByStationIdGroupIdStartDateEndDate': {
                method: "GET", params: { stationId: "@stationId", groupId: "@groupId", startDate: "@startDate", endDate: "@endDate" },
                url: benthicEventApiUrl + '?$expand=Station,Group,BenthicEventConditions($expand=BenthicCondition)&$orderby=DateTime&$filter=StationId eq :stationId and GroupId eq :groupId and DateTime gt :startDate and DateTime lt :endDate'
            },
            'getByGroupIdStartDateEndDate': {
                method: "GET", params: { groupId: "@groupId", startDate: "@startDate", endDate: "@endDate" },
                url: benthicEventApiUrl + '?$expand=Station,Group,BenthicEventConditions($expand=BenthicCondition)&$orderby=DateTime&$filter=GroupId eq :groupId and DateTime gt :startDate and DateTime lt :endDate'
            },
            'getByGroupIdStartDateEndDateUser': {
                method: "GET", params: { groupId: "@groupId", startDate: "@startDate", endDate: "@endDate", userId: "@userId" },
                url: benthicEventApiUrl + '?$expand=Station,Group,BenthicEventConditions($expand=BenthicCondition)&$orderby=DateTime&$filter=GroupId eq :groupId and DateTime gt :startDate and DateTime lt :endDate and CreatedBy eq :userId'
            },
            'save': { method: "POST", url: benthicEventApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: benthicEventApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: benthicEventApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: benthicEventApiUrl + "(:key)" }
        })
    };
    benthicEventService.$inject = ['$resource', 'benthicEventApiUrl'];
    app.factory("benthicEventService", benthicEventService).factory('notificationFactory', function () {
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