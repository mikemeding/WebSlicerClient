/**
 * Created by mike on 9/25/15.
 */
(function () {
    var app = angular.module("WebSlicer");


    app.controller("SettingsController", ["$http", "$scope", function ($http, $scope) {

        // parse settings file into large object
        $http.get('model/profile/settings.json').success(function (data) {
            $scope.settings = data.settings;
            //console.log($scope.settings);
        });

        // split this object amongst all of the services


    }]);





})();