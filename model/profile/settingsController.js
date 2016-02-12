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
             NORMAL SETTINGS
             Trying to override unknown setting solid_layer_thickness.
             Trying to override unknown setting fill_density.
             Trying to override unknown setting print_speed.
             Trying to override unknown setting print_temperature.
             Trying to override unknown setting print_bed_temperature.
             Trying to override unknown setting support.
             Trying to override unknown setting platform_adhesion.
             Trying to override unknown setting filament_diameter.
             Trying to override unknown setting filament_flow.
             Trying to override unknown setting nozzle_size.
             Trying to override unknown setting retraction_dual_amount.
             Trying to override unknown setting retraction_minimal_extrusion.
             Trying to override unknown setting layer0_width_factor.
             Trying to override unknown setting object_sink.
             Trying to override unknown setting overlap_dual.
             Trying to override unknown setting travel_speed.
             Trying to override unknown setting bottom_layer_speed.
             Trying to override unknown setting infill_speed.
             Trying to override unknown setting solidarea_speed.
             Trying to override unknown setting inset0_speed.
             Trying to override unknown setting insetx_speed.
             Trying to override unknown setting fan_enabled.
             Trying to override unknown setting support_fill_rate.
             Trying to override unknown setting fan_full_height.
             Trying to override unknown setting fan_speed.
             Trying to override unknown setting fan_speed_max.
             Trying to override unknown setting cool_min_feedrate.
             Trying to override unknown setting cool_head_lift.
             Trying to override unknown setting solid_top.
             Trying to override unknown setting solid_bottom.
             Trying to override unknown setting fill_overlap.
             Trying to override unknown setting perimeter_before_infill.
             Trying to override unknown setting spiralize.
             Trying to override unknown setting simple_mode.
             Trying to override unknown setting raft_line_spacing.
             Trying to override unknown setting raft_base_linewidth.
             Trying to override unknown setting raft_interface_linewidth.
             Trying to override unknown setting raft_airgap_all.
             Trying to override unknown setting raft_surface_linewidth.
             Trying to override unknown setting fix_horrible_union_all_type_a.
             Trying to override unknown setting fix_horrible_union_all_type_b.
             Trying to override unknown setting fix_horrible_use_open_bits.
             Trying to override unknown setting fix_horrible_extensive_stitching.
             Trying to override unknown setting ooze_shield.
             Trying to override unknown setting wipe_tower.
             Trying to override unknown setting wipe_tower_volume.
             Trying to override unknown setting support_dual_extrusion.

             OVERRIDES ONLY SETTINGS
             machine_nozzle_offset_y
             machine_nozzle_offset_x
             machine_extruder_start_code
             machine_extruder_end_code
             switch_extruder_retraction_amount
             switch_extruder_retraction_speed
             switch_extruder_prime_speed
             machine_use_extruder_offset_to_offset_coords
             prime_tower_flow
             prime_tower_line_width
             speed_prime_tower
             */

            var overrideBlackList = [
                "material_print_temperature",
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