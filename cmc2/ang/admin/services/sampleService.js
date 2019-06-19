(function (app) {
    var sampleService = function ($resource, sampleApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: sampleApiUrl },
            'getById': { method: "GET", params: { key: "@key" }, url: sampleApiUrl + "(:key)" },
            'getByGroup':{
                method: "GET", params: { groupId: "@groupId"},
                url: sampleApiUrl + '?$expand=Parameter,Qualifier,Problem,Event($expand=Station,Group)&$filter=Event/GroupId eq :groupId'
            }, 
            'getByStationId':{
                method: "GET", params: { stationId: "@stationId" },
                url: sampleApiUrl + '?$expand=Event($expand=Station,Group)&$filter=Event/StationId eq :stationId'
            },
            'getByStationIdAndCreatedById': {
                method: "GET", params: { stationId: "@stationId",userId:"@userId" },
                url: sampleApiUrl + "?$expand=Event($expand=Station,Group)&$filter=Event/StationId eq :stationId" +
                    " and CreatedBy eq ':userId' and QaFlagId eq 1"
            },
            'getByStationIdAndGroupIdAndQAFlagIdLessThan2': {
                method: "GET", params: { stationId: "@stationId", groupId: "@groupId" },
                url: sampleApiUrl + "?$expand=Event($expand=Station,Group)&$filter=Event/StationId eq :stationId" +
                    " and Event/GroupId eq :groupId and QaFlagId lt 2"
            },
            'getByStationIdAndGroupId': {
                method: "GET", params: { stationId: "@stationId", groupId: "@groupId" },
                url: sampleApiUrl + "?$expand=Event($expand=Station,Group)&$filter=Event/StationId eq :stationId" +
                    " and Event/GroupId eq :groupId"
            },
            'getByEventId': {
                method: "GET", params: { eventId: "@eventId" },
                url: sampleApiUrl + '?$expand=Event($expand=Station,Group),Parameter&$filter=Event/Id eq :eventId'
            },
            'getDataDownloadMonitor': {
                method: "GET", params: { stationId: "@stationId",userId:"@userId" },
                url: sampleApiUrl + "?$expand=Parameter,Qualifier,Problem,Event($expand=Station,Group,EventConditions($expand=Condition),MonitorLogs($expand=ApplicationUser))&$filter=Event/StationId eq :stationId" +
                    " and CreatedBy eq ':userId' and QaFlagId eq 1"
            },
            'getDataDownloadCoordinator': {
                method: "GET", params: { stationId: "@stationId", groupId: "@groupId" },
                url: sampleApiUrl + "?$expand=Parameter,Qualifier,Problem,Event($expand=Station,Group,EventConditions($expand=Condition),MonitorLogs($expand=ApplicationUser))&$filter=Event/StationId eq :stationId" +
                    " and Event/GroupId eq :groupId"
            },'getDataDownloadOfficer': {
                method: "GET", params: { stationId: "@stationId" },
                url: sampleApiUrl + '?$expand=Parameter,Qualifier,Problem,Event($expand=Station,Group,EventConditions($expand=Condition),MonitorLogs($expand=ApplicationUser))&$filter=Event/StationId eq :stationId'
            },
            'newGroupSamples': {
                method: "GET", params: { minDateTime: "@minDateTime", groupId: "@groupId" },
                url: sampleApiUrl + '?$expand=Event&$filter=CreatedDate gt :minDateTime and Event/GroupId eq :groupId'
            },
            'userSamplesNotPublished': {
                method: "GET", params: { userId: "@userId" },
                url: sampleApiUrl + "?$filter=CreatedBy eq ':userId' and QaFlagId eq 1"
            },
            'save': { method: "POST", url: sampleApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: sampleApiUrl + '(:key)' },
            'put': { method: 'PUT', params: { key: '@key' }, url: sampleApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: sampleApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: sampleApiUrl + "(:key)" }
        })
    };
    sampleService.$inject = ['$resource', 'sampleApiUrl'];
    app.factory("sampleService", sampleService).factory('notificationFactory', function () {
        return {
            clear:function(){
                toastr.clear();
            },
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