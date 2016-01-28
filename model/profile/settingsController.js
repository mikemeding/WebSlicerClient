/**
 * Created by mike on 1/28/16.
 */
(function () {
    var app = angular.module("WebSlicer", []);

    app.controller("SettingsController", ["$http", "$scope", function ($http, $scope) {

        // parse settings file into large object
        $http.get('model/profile/settings.json').success(function (data) {
            $scope.settings = data;
            console.log($scope.settings);
        });

        // split this object amongst all of the services


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
    }]);

})();