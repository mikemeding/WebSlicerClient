/**
 * Created by mike on 1/28/16.
 */
(function () {
    var app = angular.module("WebSlicer");
    app.controller("OctoprintController", ["$http", "$scope", function ($http, $scope) {

        $scope.url = "";
        $scope.port = "";
        $scope.apiKey = "";
        $scope.otherUrl = false;

        /**
         * Settings object should look like this,
         * {"url":"","port":"","apiKey":""}
         *
         * call get defaults with an api key for another example
         * @returns {string}
         */
        $scope.pingOctoprint = function () {
            // figure out if url requires port
            var address = getDefault();
            if ($scope.port && $scope.url !== address) {
                address = $scope.url + ":" + $scope.port;
            } else {
                if ($scope.url) {
                    address = $scope.url + ":5000";

                }
            }

            console.log(address);
            console.log("API Key: " + $scope.apiKey);
            //$http({
            //    method: 'GET',
            //    url: 'http://' + $scope.url + '/api/printer',
            //    headers: {
            //        'Content-Type': 'application/json',
            //        'x-api-key': apiKey
            //    }
            //}).then(function successCallback(response) {
            //    console.log(response);
            //    $scope.data = response.data;
            //    $scope.dataHere = true;
            //}, function errorCallback(response) {
            //    console.error(response);
            //});
        };

        /**
         * Get the default connection params for OctoPi
         *
         * @param apiKey The OctoPrint api key.
         * @returns {{url: string, port: string, apiKey: string}}
         */
        function getDefault() {
            return "octopi.local";
        };

    }]);
})();