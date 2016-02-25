/**
 * Created by mike on 9/25/15.
 */
(function () {
    var app = angular.module("WebSlicer");


    app.controller("SettingsController", ["$http", "$scope", "$rootScope", function ($http, $scope, $rootScope) {

        /**
         * Upload the settings as a formatted JSONObject to the server for slicing
         */
        $rootScope.importSettings = function () {
            var data = buildSettingsObject();
            return $http({
                method: 'POST',
                url: $rootScope.baseUrl + "/importSettings/" + $scope.clientId,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            })
        };

        function buildSettingsObject() {
            /*
             CONFIRMED WORKING SETTINGS
             "wall_line_count",
             "machine_start_gcode",
             "machine_end_gcode",
             "machine_width",
             "machine_depth",
             "machine_height",
             "material_print_temperature",
             "material_bed_temperature",
             "material_diameter",
             */

            var overrideBlackList = [
                "wall_line_count",
                "machine_start_gcode",
                "machine_end_gcode",
                "machine_width",
                "machine_depth",
                "machine_height",
                "machine_heated_bed",
                "machine_head_with_fans_polygon",
                "machine_center_is_zero",
                "machine_nozzle_size",
                "machine_nozzle_heat_up_speed",
                "machine_nozzle_cool_down_speed",
                "gantry_height",
                "machine_use_extruder_offset_to_offset_coords",
                "machine_gcode_flavor",
                "machine_disallowed_areas",
                "machine_platform_offset",
                "machine_nozzle_tip_outer_diameter",
                "machine_nozzle_head_distance",
                "machine_nozzle_expansion_angle",
                "material_print_temperature",
                "material_bed_temperature",
                "material_diameter",
                "material_flow"
            ];

            var overrides = {};
            var normal = {};

            // build override object from all settings
            for (var prop in $rootScope.settingsTracker) {
                //console.log("obj." + prop + " = " + $rootScope.settingsTracker[prop]);
                var temp = {};
                for (var item in $rootScope.settingsTracker[prop]) {
                    temp = {}; // clear object
                    var name = $rootScope.settingsTracker[prop][item].setting;

                    // construct item. (2D arrays are hateful. lucky this one is small)
                    temp[name] = {"default": $rootScope.settingsTracker[prop][item].default};

                    // if item is not in blacklist
                    if (overrideBlackList.indexOf(name) === -1) {
                        angular.extend(normal, temp);
                    } else {
                        angular.extend(overrides, temp);
                    }
                }
            }

            var header = {
                "id": "prusa_i3", "version": 1,
                "name": $scope.name,
                "manufacturer": "Other",
                "author": "Other",
                "icon": "icon_ultimaker2.png",
                "platform": "prusai3_platform.stl",
                "inherits": "fdmprinter.json", // this must come from a symbolic link in the directory.
                "overrides": overrides
            };

            var output = angular.merge(header, normal);
            console.log(output);
            return output;
        }

    }]);


})();