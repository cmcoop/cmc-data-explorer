(function (app) {
    var groupService = function ($resource, groupApiUrl) {
        return $resource("", {}, {
            'getAllLessDetail': { method: "GET", url: groupApiUrl + "?$orderby=Name" },
            'getAll': { method: "GET", url: groupApiUrl + "?$expand=CmcMemberUser,CmcMemberUser2,CmcMemberUser3,ParameterGroups($select=Parameter,LabId,DetectionLimit;$expand=Parameter)&$orderby=Name" },
            'getById': { method: "GET", params: { key: "@key" }, url: groupApiUrl + "(:key)" + "?$expand=ParameterGroups($select=Parameter;$expand=Parameter)" },
            'getByIdNoLabData': { method: "GET", params: { key: "@key" }, url: groupApiUrl + "(:key)" + "?$expand=ParameterGroups($filter=Parameter/AnalyticalMethod ne 'Lab';$select=Parameter;$expand=Parameter)" },
            'getByName': { method: "GET", params: { key: "@key" }, url: groupApiUrl + "?$filter=Name eq " + "':key'" },
            'getByGroupCode': { method: "GET", params: { key: "@key" }, url: groupApiUrl + "?$filter=Code eq " + "':key'" },
            'getByGroupCodeStartsWith': { method: "GET", params: { key: "@key" }, url: groupApiUrl + "?$filter=startswith(Code," + "':key'" + ")&$orderby=Code desc" },
            'deleteGroupParameters': { method: "DELETE", params: { key: "@key" }, url: groupApiUrl + "(:key)" + "/ParameterGroups" },
            'postGroupParameters': { method: "POST", params: { key: "@key" }, url: groupApiUrl + "(:key)" + "/ParameterGroups" },           
            'save': { method: "POST", url: groupApiUrl },
            'patch': { method: 'PATCH', params: { key: '@key' }, url: groupApiUrl + '(:key)' },
            'query': { method: 'GET', params: { key: "@key" }, url: groupApiUrl + "(:key)" },
            'remove': { method: 'DELETE', params: { key: "@key" }, url: groupApiUrl + "(:key)" }            
        })
    };
    groupService.$inject = ['$resource', 'groupApiUrl'];
    app.factory("groupService", groupService).factory('notificationFactory', function () {
        return {
            success: function (text,title,options) {
                toastr.clear();
                toastr.success(text, title, options);
            },
            error: function (text) {
                toastr.error(text, "Error");
            }
        };
    });
}(angular.module("cmcApp")));