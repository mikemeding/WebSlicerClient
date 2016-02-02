/**
 * Created by mike on 1/28/16.
 */
(function () {
    var app = angular.module("WebSlicer");
    app.controller("OctoprintController", ["$http", "$scope", "OctoprintService", function ($http, $scope, OctoprintService) {

        //TODO: these need to be refactored
        $scope.url = "";
        $scope.port = "";
        $scope.apiKey = "";
        $scope.otherUrl = false;
        $scope.octoprintData = {};
        $scope.octoprintDataHere = false;

        /**
         * Settings object should look like this,
         * {"url":"","port":"","apiKey":""}
         *
         * call get defaults with an api key for another example
         * @returns {string}
         */
        $scope.pingOctoprint = function () {
            // figure out if url requires port and preform address resolution
            var address = OctoprintService.getDefaultAddress();
            if ($scope.port && $scope.url !== address) {
                address = $scope.url + ":" + $scope.port;
            } else {
                if ($scope.url) {
                    address = $scope.url + ":5000";
                }
            }

            console.log(address);
            console.log("API Key: " + $scope.apiKey);

            // wait and resolve promise from pinging new octoprint server
            OctoprintService.ping(address, $scope.apiKey)
                .then(function successCallback(response) {
                    console.log(response);
                    $scope.octoprintData = response.data;
                    $scope.octoprintDataHere = true;
                }, function errorCallback(response) {
                    console.error(response);
                    $scope.octoprintDataHere = false;
                });


        };


    }]);
})();