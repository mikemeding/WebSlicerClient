/**
 * Created by mike on 9/25/15.
 */
(function () {
    var app = angular.module("WebSlicer");


    app.controller("SettingsController", ["$http", "$scope", function ($http, $scope) {

        // parse settings file into large object
        //$http.get('model/profile/settings.json').success(function (data) {
        //    $scope.settings = data.settings;
        //    //console.log($scope.settings);
        //});

        $scope.settingItem = {
            "layer_height": 0.1,
            "wall_thickness": 0.8,
            "retraction_enable": true
        };

    }]);





})();