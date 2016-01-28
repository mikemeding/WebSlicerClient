/**
 * Created by mike on 9/25/15.
 */
(function () {
    var app = angular.module("WebSlicer", []);

    //TODO: split directive and service to their own file.
    app.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

    app.controller("SettingsController", ["$http", "$scope", function ($http, $scope) {
        // environment vars
        var baseUrl = "http://localhost:8080/WebSlicer/slicer";
        $scope.title = "Web Slicer";
        $scope.dataHere = false;
        $scope.clientId = "";
        $scope.modelFiles = {};
        $scope.gcode = {"gcode": ""};

        // make gcode available for download
        var blob = new Blob([$scope.gcode.gcode], {type: 'text/plain'});
        $scope.gcodeDownload = (window.URL || window.webkitURL).createObjectURL(blob);


        /**
         * Test to make sure that our server exists
         */
        $scope.pingOctoPrint = function () {
            $http({
                method: 'GET',
                //url: 'http://' + $scope.address + ':' + $scope.port + '/api/printer',
                url: 'http://' + $scope.address + '/api/printer',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': $scope.apiKey
                }
            }).then(function successCallback(response) {
                console.log(response);
                $scope.data = response.data;
                $scope.dataHere = true;
            }, function errorCallback(response) {
                console.error(response);
            });
        };

        /**
         * Generate a new client id and layout all of the files for this new client on the server
         */
        $scope.generateClientId = function () {
            $http({
                method: 'POST',
                url: baseUrl + "/setupClient"
            }).then(function successCallback(response) {
                console.log(response);
                $scope.clientId = response.data.clientId;
            }, function errorCallback(response) {
                console.error(response);
            });
        };

        /**
         * Get the list of flies associated with a client.
         */
        $scope.getFileList = function () {
            $http({
                method: 'GET',
                url: baseUrl + "/getFiles/" + $scope.clientId
            }).then(function successCallback(response) {
                console.log(response);
                $scope.modelFiles = response.data;

                // print out all of the files
                for (var key in $scope.modelFiles) {
                    if ($scope.modelFiles.hasOwnProperty(key)) {
                        console.log(key + " -> " + $scope.modelFiles[key]);
                    }
                }
            }, function errorCallback(response) {
                console.error(response);
            });
        };

        /**
         * change the working file that we are slicing with.
         */
        $scope.changeWorkingFile = function (modelId) {
            console.log(modelId);
            $scope.modelFileId = modelId;
        };

        /**
         * Upload the settings as a formatted JSONObject to the server for slicing
         */
        $scope.importSettings = function () {
            $http({
                method: 'POST',
                url: baseUrl + "/importSe ttings/" + $scope.clientId,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: buildSettingsObject()
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(response) {
                console.error(response);
            });
        };


        /**
         * Fire off a file upload of a MIME type model file.
         */
        $scope.uploadFile = function () {
            var file = $scope.myFile;
            console.log('file is ');
            console.dir(file);
            var uploadUrl = baseUrl + "/importStl/" + $scope.clientId;
            var fd = new FormData();

            fd.append('file', file);
            $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function (response) {
                    //console.log(response);
                    $scope.modelFileId = response.fileId;
                    console.log($scope.modelFileId);
                })
                .error(function () {
                });


            //$scope.modelFileId = fileUpload.uploadFileToUrl(file, uploadUrl);
        };

        /**
         * The main slice function. This will only operate if the client has both uploaded a settings file and a model file.
         * Both of these files will be given an id that the client must track in order to slice a file properly.
         *
         * @param modelId
         * @param settingsId
         */
        $scope.slice = function (modelId) {
            if (modelId) {
                // send slice request
                $http({
                    method: 'POST',
                    url: baseUrl + "/slice/" + $scope.clientId + "/" + modelId
                }).then(function successCallback(response) {
                    // capture our gcode as a response.
                    console.log(response);
                    $scope.gcode = response.data;

                }, function errorCallback(response) {
                    console.error(response);
                });
            } else {
                console.error("model or settings id missing");
            }
        }

    }]);
})();