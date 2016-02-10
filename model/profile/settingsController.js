/**
 * Created by mike on 9/25/15.
 */
(function () {
    var app = angular.module("WebSlicer");


    app.controller("SettingsController", ["$http", "$scope", function ($http, $scope) {

        $scope.basicSettings = [];
        $scope.advancedSettings = [];
        $scope.fineTuneSettings = [];
        $scope.machineSettings = [];
        //$scope.startEndGcodeSettings =[];

        /**
         * PULL ALL SETTINGS FROM CORRESPONDING JSON FILES
         */
        var basepath = "model/profile/json/";
        $http.get(basepath + "basic.json").success(function (data) {
            $scope.basicSettings = data;
        });
        $http.get(basepath + "advanced.json").success(function (data) {
            $scope.advancedSettings = data;
        });
        $http.get(basepath + "fine-tune.json").success(function (data) {
            $scope.fineTuneSettings = data;
        });
        $http.get(basepath + "machine.json").success(function (data) {
            $scope.machineSettings = data;
        });

    }]);


})();