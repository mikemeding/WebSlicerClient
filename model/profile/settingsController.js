/**
 * Created by mike on 9/25/15.
 */
(function () {
    var app = angular.module("WebSlicer");


    app.controller("SettingsController", ["$http", "$scope", "$rootScope", function ($http, $scope, $rootScope) {

        /**
         * Upload the settings as a formatted JSONObject to the server for slicing
         */
        $scope.importSettings = function () {
            var data = buildSettingsObject();
            console.log(data);
            $http({
                method: 'POST',
                url: $rootScope.baseUrl + "/importSettings/" + $scope.clientId,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(response) {
                console.error(response);
            });
        };

        function buildSettingsObject() {
            var overrides = {};

            // build override object from all settings
            for (var prop in $rootScope.settingsTracker) {
                //console.log("obj." + prop + " = " + $rootScope.settingsTracker[prop]);
                var temp = {};
                for (var item in $rootScope.settingsTracker[prop]) {
                    temp[$rootScope.settingsTracker[prop][item].setting] = {"default": $rootScope.settingsTracker[prop][item].default};
                }

                //console.log(temp);
                angular.merge(overrides, temp);

            }
            return {
                "id": "prusa_i3", "version": 1,
                "name": $scope.name,
                "manufacturer": "Other",
                "author": "Other",
                "icon": "icon_ultimaker2.png",
                "platform": "prusai3_platform.stl",
                "inherits": "fdmprinter.json", // this must come from a symbolic link in the directory.
                "overrides": overrides
            };
        }

    }]);


})();