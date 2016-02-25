/**
 * Created by mike on 2/1/16.
 */
(function () {
    var app = angular.module("WebSlicer");

    app.service("OctoprintService", ["$http", function ($http) {

        /**
         * This just returns some basic info about the printer and displays it.
         * @param url
         * @param apiKey
         * @returns {*}
         */
        this.connection = function (url, apiKey) {
            return $http({
                    method: 'GET',
                    url: 'http://' + url + '/api/connection',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey
                    }
                }
            )
        };

        /**
         * Gets the list of files currently uploaded to the octoprint local address
         * @param url
         * @param apiKey
         * @returns {*}
         */
        this.getFileList = function (url, apiKey) {
            return $http({
                method: 'GET',
                url: 'http://' + url + '/api/files',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                }
            })
        };

        /**
         * Get the current status of the printer including current temps
         * @param url
         * @param apiKey
         * @returns {*}
         */
        this.getPrinterInfo = function (url, apiKey) {
            return $http({
                method: 'GET',
                url: 'http://' + url + '/api/printer',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                }
            })
        };

        /**
         * Upload a new file to the octoprint server
         *
         * TODO: This need to be tested on an actual octoprint server
         * @param url
         * @param apiKey
         * @param file
         */
        this.uploadFile = function (url, apiKey, file) {
            console.log('file is ');
            console.dir(file);

            // append form data (file parts) to request
            var fd = new FormData();
            fd.append('file', file);

            // multipart/form-data post request
            return $http.post(url, fd, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-api-key':apiKey
                }
            });

        };

        /**
         * Load a filename from the local files list and start printing it right now
         * @param url
         * @param apiKey
         * @param fileName
         */
        this.printFile = function (url, apiKey, fileName) {
            console.error("functionality does not exist yet. printFile()");
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
