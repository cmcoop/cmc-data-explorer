(function (app) {
    var benthicSampleService = function ($resource, benthicSampleApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: benthicSampleApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: benthicSampleApiUrl + "(:key)" },
            'getByGroup': {
                method: "GET", params: { groupId: "@groupId" },
                url: benthicSampleApiUrl + '?$expand=BenthicParameter,BenthicEvent($expand=Station,Group)&$filter=BenthicEvent/GroupId eq :groupId'
            },
            'getByStationId':{
                method: "GET", params: { stationId: "@stationId" },
                url: benthicSampleApiUrl + '?$expand=BenthicParameter,BenthicEvent($expand=Station,Group)&$filter=BenthicEvent/StationId eq :stationId'
            },
            'getByEventIdForEdit': {
                method: "GET", params: { key: "@key" },
                url: benthicSampleApiUrl + '?$expand=BenthicParameter,BenthicEvent($expand=Station,Group)&$orderby=BenthicEvent/DateTime&$filter=BenthicEventId eq :key'
            },
            'getByStationIdGroupIdStartDateEndDate': {
                method: "GET", params: { stationId: "@stationId", groupId:"@groupId", startDate:"@startDate", endDate:"@endDate" },
                url: benthicSampleApiUrl + '?$expand=BenthicParameter,BenthicEvent($expand=Station,Group)&$orderby=BenthicEvent/DateTime&$filter=BenthicEvent/StationId eq :stationId and BenthicEvent/GroupId eq :groupId and BenthicEvent/DateTime gt :startDate and BenthicEvent/DateTime lt :endDate'
            },
            'getByGroupIdStartDateEndDate': {
                method: "GET", params: { groupId: "@groupId", startDate: "@startDate", endDate: "@endDate" },
                url: benthicSampleApiUrl + '?$expand=BenthicParameter,BenthicEvent($expand=Station,Group)&$orderby=BenthicEvent/DateTime&$filter=BenthicEvent/GroupId eq :groupId and BenthicEvent/DateTime gt :startDate and BenthicEvent/DateTime lt :endDate'
            },
            'getByStationIdAndCreatedByIdAndQAFlagId': {
                method: "GET", params: { stationId: "@stationId",userId:"@userId",qaFlagId:"@qaFlagId" },
                url: benthicSampleApiUrl + "?$expand=BenthicEvent($expand=Station,Group)&$filter=BenthicEvent/StationId eq :stationId" +
                    " and CreatedBy eq ':userId' and QaFlagId eq :qaFlagId"
            },
            'getByStationIdAndGroupIdAndQAFlagIdLessThan3': {
                method: "GET", params: { stationId: "@stationId", groupId: "@groupId" },
                url: benthicSampleApiUrl + "?$expand=BenthicEvent($expand=Station,Group)&$filter=BenthicEvent/StationId eq :stationId" +
                    " and BenthicEvent/GroupId eq :groupId and QaFlagId lt 3"
            },
            'getByEventId': {
                method: "GET", params: { stationId: "@eventId" },
                url: benthicSampleApiUrl + '?$expand=BenthicEvent($expand=Station,Group),BenthicParameter&$filter=BenthicEvent/Id eq :eventId'
            },
            'newGroupBenthicSamples': {
                method: "GET", params: { minDateTime: "@minDateTime", groupId: "@groupId" },
                url: benthicSampleApiUrl + '?$expand=BenthicEvent&$filter=CreatedDate gt :minDateTime and BenthicEvent/GroupId eq :groupId'
            },
            'userBenthicSamplesNotVerified': {
                method: "GET", params: { userId: "@userId" },
                url: benthicSampleApiUrl + "?$filter=CreatedBy eq ':userId' and QaFlagId eq 1"
            },
            'userBenthicSamplesNotPublished': {
                method: "GET", params: { userId: "@userId" },
                url: benthicSampleApiUrl + "?$filter=CreatedBy eq ':userId' and QaFlagId eq 2"
            },
            'save': { method: "POST", url: benthicSampleApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: benthicSampleApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: benthicSampleApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: benthicSampleApiUrl + "(:key)" }
        })
    };
    benthicSampleService.$inject = ['$resource', 'benthicSampleApiUrl'];
    app.factory("benthicSampleService", benthicSampleService).factory('notificationFactory', function () {
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