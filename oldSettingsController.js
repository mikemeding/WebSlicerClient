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

    app.controller("OldSettingsController", ["$http", "$scope", OldSettingsController]);

    function OldSettingsController($http, $scope) {
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

        // defaults for settings (until i can get this from profile files)
        $scope.name = "default name";
        $scope.machine_heated_bed = true;
        $scope.machine_width = 200;
        $scope.machine_height = 200;
        $scope.machine_depth = 200;
        $scope.machine_center_is_zero = false;
        $scope.machine_nozzle_size = 0.4;
        $scope.machine_nozzle_heat_up_speed = 2.0;
        $scope.machine_nozzle_cool_down_speed = 2.0;
        $scope.machine_head_shape_min_x = 75;
        $scope.machine_head_shape_min_y = 18;
        $scope.machine_head_shape_max_x = 18;
        $scope.machine_head_shape_max_y = 35;
        $scope.machine_nozzle_gantry_distance = 55;
        $scope.machine_gcode_flavor = "RepRap (Marlin/Sprinter)";
        $scope.machine_start_gcode = {
            "default": "G21 ;metric values\nG90 ;absolute positioning\nM82 ;set extruder to absolute mode\nM107 ;start with the fan off\nG28 X0 Y0 ;move X/Y to min endstops\nG28 Z0 ;move Z to min endstops\nG1 Z15.0 F9000 ;move the platform down 15mm\nG92 E0 ;zero the extruded length\nG1 F200 E3 ;extrude 3mm of feed stock\nG92 E0 ;zero the extruded length again\nG1 F9000\n;Put printing message on LCD screen\nM117 Printing..."
        };
        $scope.machine_end_gcode = {
            "default": "M104 S0 ;extruder heater off\nM140 S0 ;heated bed heater off (if you have it)\nG91 ;relative positioning\nG1 E-1 F300  ;retract the filament a bit before lifting the nozzle, to release some of the pressure\nG1 Z+0.5 E-5 X-20 Y-20 F9000 ;move Z up a bit and retract filament even more\nG28 X0 Y0 ;move X/Y to min endstops, so the head is out of the way\nM84 ;steppers off\nG90 ;absolute positioning"
        };

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
        };

        function buildSettingsObject() {
            return {
                "id": "prusa_i3", "version": 1,
                "name": $scope.name,
                "manufacturer": "Other",
                "author": "Other",
                "icon": "icon_ultimaker2.png",
                "platform": "prusai3_platform.stl",
                "inherits": "fdmprinter.json", // this must come from a symbolic link in the directory.
                "overrides": {
                    "machine_heated_bed": {"default": $scope.machine_heated_bed},
                    "machine_width": {"default": $scope.machine_width},
                    "machine_height": {"default": $scope.machine_height},
                    "machine_depth": {"default": $scope.machine_depth},
                    "machine_center_is_zero": {"default": $scope.machine_center_is_zero},
                    "machine_nozzle_size": {"default": $scope.machine_nozzle_size},
                    "machine_nozzle_heat_up_speed": {"default": $scope.machine_nozzle_heat_up_speed},
                    "machine_nozzle_cool_down_speed": {"default": $scope.machine_nozzle_cool_down_speed},
                    "machine_head_shape_min_x": {"default": $scope.machine_head_shape_min_x},
                    "machine_head_shape_min_y": {"default": $scope.machine_head_shape_min_y},
                    "machine_head_shape_max_x": {"default": $scope.machine_head_shape_max_x},
                    "machine_head_shape_max_y": {"default": $scope.machine_head_shape_max_y},
                    "machine_nozzle_gantry_distance": {"default": $scope.machine_nozzle_gantry_distance},
                    "machine_gcode_flavor": {"default": $scope.machine_gcode_flavor},
                    "machine_start_gcode": $scope.machine_start_gcode,
                    "machine_end_gcode": $scope.machine_end_gcode
                }
            };
        }

    }



})();