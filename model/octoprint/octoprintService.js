/**
 * Created by mike on 2/1/16.
 */
(function () {
    var app = angular.module("WebSlicer");

    app.service("OctoprintService", ["$http", function ($http) {

        this.ping = function (url, apiKey) {
            return $http({
                    method: 'GET',
                    url: 'http://' + url + '/api/printer',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey
                    }
                }
            )
        };


        /**
         * Get the default connection params for OctoPi
         *
         * @param apiKey The OctoPrint api key.
         * @returns {{url: string, port: string, apiKey: string}}
         */
        this.getDefaultAddress = function () {
            return "octopi.local";
        };
    }]);

})();
