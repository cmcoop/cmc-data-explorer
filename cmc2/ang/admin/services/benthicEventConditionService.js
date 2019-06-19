(function (app) {
    var benthicEventConditionService = function ($resource, benthicEventConditionApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: benthicEventConditionApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: benthicEventConditionApiUrl + "(:key)" },
            'getByEventId': { method: "GET", params: { key: "@key" }, url: benthicEventConditionApiUrl + "?$filter=BenthicEventId eq " + '(:key)' },
            'getByEventIdAndConditionId': { method: "GET", params: { benthicConditionId: "@benthicConditionId", benthicEventId: "@benthicEventId" }, url: benthicEventConditionApiUrl + '?$filter=BenthicEventId eq :benthicEventId and BenthicConditionId eq :benthicConditionId' },
            'getByStationIdGroupIdStartDateEndDate': {
                method: "GET", params: { stationId: "@stationId", groupId: "@groupId", startDate: "@startDate", endDate: "@endDate" },
                url: benthicEventConditionApiUrl + '?$expand=BenthicCondition,BenthicEvent($expand=Station,Group)&$orderby=BenthicEvent/DateTime&$filter=BenthicEvent/StationId eq :stationId and BenthicEvent/GroupId eq :groupId and BenthicEvent/DateTime gt :startDate and BenthicEvent/DateTime lt :endDate'
            },
            'getByGroupIdStartDateEndDate': {
                method: "GET", params: { groupId: "@groupId", startDate: "@startDate", endDate: "@endDate" },
                url: benthicEventConditionApiUrl + '?$expand=BenthicCondition,BenthicEvent($expand=Station,Group)&$orderby=BenthicEvent/DateTime&$filter=BenthicEvent/GroupId eq :groupId and BenthicEvent/DateTime gt :startDate and BenthicEvent/DateTime lt :endDate'
            },
            'getByStationIdGroupIdStartDateEndDateUser': {
                method: "GET", params: { stationId: "@stationId", groupId: "@groupId", startDate: "@startDate", endDate: "@endDate" },
                url: benthicEventConditionApiUrl + '?$expand=BenthicCondition,BenthicEvent($expand=Station,Group)&$orderby=BenthicEvent/DateTime&$filter=BenthicEvent/StationId eq :stationId and BenthicEvent/GroupId eq :groupId and BenthicEvent/DateTime gt :startDate and BenthicEvent/DateTime lt :endDate and BenthicEvent/CreatedBy eq :userId'
            },
            'getByGroupIdStartDateEndDateUser': {
                method: "GET", params: { groupId: "@groupId", startDate: "@startDate", endDate: "@endDate", userId: "@userId" },
                url: benthicEventConditionApiUrl + '?$expand=BenthicCondition,BenthicEvent($expand=Station,Group)&$orderby=BenthicEvent/DateTime&$filter=BenthicEvent/GroupId eq :groupId and BenthicEvent/DateTime gt :startDate and BenthicEvent/DateTime lt :endDate and BenthicEvent/CreatedBy eq :userId'
            },
            'save': { method: "POST", url: benthicEventConditionApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: benthicEventConditionApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: benthicEventConditionApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: benthicEventConditionApiUrl + "(:key)" }
        })
    };
    benthicEventConditionService.$inject = ['$resource', 'benthicEventConditionApiUrl'];
    app.factory("benthicEventConditionService", benthicEventConditionService).factory('notificationFactory', function () {
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