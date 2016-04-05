/**
 * Created by mike on 1/28/16.
 */
(function () {
    var app = angular.module("WebSlicer");
    app.controller("OctoprintController", ["$http", "$scope", "$rootScope", "OctoprintService", function ($http, $scope, $rootScope, OctoprintService) {

        // form collection scope variables
        $scope.url = "";
        $scope.port = "";
        $scope.apiKey = "";
        $scope.otherUrl = false;

        // data objects to be displayed
        $scope.octoprintStatus = {};
        $scope.octoprintFiles = [];

        // internal referance variables
        $scope.displayOctoprintData = false;
        $scope.connectionStatus = false;
        $scope.connectedAddress = "";


        var APIError = function (message, where) {
            console.error(message);
            if (where) {
                console.error("from: " + where);
            }
            $scope.displayOctoprintData = false;
        };

        /**
         * Settings object should look like this,
         * {"url":"","port":"","apiKey":""}
         *
         * call get defaults with an api key for another example
         * @returns {string}
         */
        $scope.connectOctoprint = function () {
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
            $scope.connectedAddress = address;


            // wait and resolve promise from pinging new octoprint server
            OctoprintService.connection(address, $scope.apiKey)
                .then(function successCallback(response) {
                    console.log(response);
                    if (response.data.current.state === "Operational") {
                        $scope.connectionStatus = true;

                        // operational connection. make data requests
                        $scope.getOctoprintStatus(); // get the current printer status
                        $scope.getOctoprintFiles(); // get current list of files


                    } else {
                        APIError("Error: Printer not operational.");
                        $scope.connectionStatus = false;
                    }

                }, function errorCallback(response) {
                    APIError(response, "connectOctoprint");
                });
        };

        /**
         * Testing getting the files list from octoprint
         */
        $scope.getOctoprintFiles = function () {
            OctoprintService.getFileList($scope.connectedAddress, $scope.apiKey)
                .then(function successCallback(response) {
                    console.log(response);
                    if (response.data.files) {
                        $scope.octoprintFiles = response.data.files;
                        $scope.octoprintDataHere = true;
                    }

                }, function errorCallback(response) {
                    APIError(response, "getOctoprintFiles");
                });
        };

        /**
         * Get a basic status message with the current printer temps and connection status
         */
        $scope.getOctoprintStatus = function () {
            OctoprintService.getPrinterInfo($scope.connectedAddress, $scope.apiKey)
                .then(function successCallback(response) {
                    console.log(response);
                    if (response.data) {
                        $scope.octoprintStatus = response.data;
                    }

                }, function errorCallback(response) {
                    APIError(response, "getOctoprintStatus");
                });
        };

        /**
         * Send the current gcode file to the octoprint server
         */
        $scope.postOctoprintFile = function () {
            console.log($rootScope.gcode);

            OctoprintService.uploadFile($scope.connectedAddress, $scope.apiKey, $rootScope.gcode)
                .then(function successCallback(response) {
                    console.log(response);
                }, function errorCallback(response) {
                    APIError(response, "postOctoprintFile");
                });
        }


    }]);
})();