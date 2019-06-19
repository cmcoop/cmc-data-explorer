(function (app) {
    var userService = function ($resource, userApiUrl) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: userApiUrl + "?$expand=Group" },
            'getByUserId': { method: "GET", url: userApiUrl + "?$filter=Id eq " + "':key'" + "&$expand=Group" },
            'getCmcMembersByUserId': {
                method: "GET", url: userApiUrl + "?$filter=Id eq " + "':cmcMember1'" + " or Id eq " + "':cmcMember2'" + " or Id eq " + "':cmcMember3'"
                    + "&$expand=Group"
            },
            'getUsersInGroup': { method: "GET", params: { key: "@key" }, url: userApiUrl + "?$filter=GroupId eq " + "(:key)" + "&$expand=Group" },
            'getNewUsersInGroup': {
                method: "GET", params: { minDateTime: "@minDateTime", key: "@key" },
                url: userApiUrl + "?$filter=GroupId eq " + "(:key)" + " and CreatedDate gt :minDateTime&$expand=Group"
            },
            'getActiveUsersInGroup': { method: "GET", params: { key: "@key" }, url: userApiUrl + "?$filter=GroupId eq " + "(:key)" + " and Status eq true&$expand=Group" },
            'getMembers': {
                method: "GET", 
                url: userApiUrl + "?$filter=Role eq '40be264b-2ac0-4a74-9772-fc49213ea705' or Role eq 'b22ab5dc-d645-44b7-9c1a-2920d5506fd8'"
            },

            'patch': { method: 'PATCH', params: { key: '@key' }, url: userApiUrl + "(':key')" }
        })
    };

    userService.$inject = ['$resource', 'userApiUrl'];

    app.factory("userService", userService).factory('notificationFactory', function () {
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