(function (app) {
    var userService = function ($resource, userApiUrl2) {
        return $resource("", {}, {
            'getAll': { method: "GET", url: userApiUrl2 + "?$expand=Group" },
            'getUsersInGroup': { method: "GET", params: { key: "@key" }, url: userApiUrl2 + userApiUrl + "?$filter=GroupId eq " + "(:key)" + "&$expand=Group" },
        })
    };

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