/**
 * Created by mike on 1/28/16.
 */
(function () {
    var app = angular.module("WebSlicer", []);
    app.factory("OctoprintFactory", function () {
        return {
            /**
             * Settings object should look like this,
             * {"url":"","port":"","apiKey":""}
             *
             * call get defaults with an api key for another example
             * @param octoprintSettings
             * @returns {string}
             */
            ping: function (octoprintSettings) {
                console.log(octoprintSettings);
                return "header goes here";
            },

            /**
             * Get the default connection params for OctoPi
             *
             * @param apiKey The OctoPrint api key.
             * @returns {{url: string, port: string, apiKey: string}}
             */
            getDefaults: function (apiKey) {
                return {"url": "octopi.local", "port": "", "apiKey": apiKey};
            }
        }
    });
    app.controller("OctoprintController", ["$http", "$scope", "OctoprintFactory", function ($http, $scope, OctoprintFactory) {
        console.log(OctoprintFactory.getDefaults("someapikey"));
    }]);
})();