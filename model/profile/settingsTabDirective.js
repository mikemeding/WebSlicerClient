/**
 * This is the directive which when given a json file as an argument will render the settings contained within as fields that can be edited.
 * Those fields can then be compliled into a larger file to be sent to the main server
 *
 * SAMPLE SETTING OBJECT
 * "setting": "layer_height",
 * "default": 0.1,
 * "type": "float",
 * "category": "Quality",
 * "label": "Layer Height (mm)",
 * "description": "Layer height in millimeters.\nThis is the most important setting to determine the quality of your print. Normal quality prints are 0.1mm, high quality is 0.06mm. You can go up to 0.25mm with an Ultimaker for very fast prints at low quality."
 *
 * Created by mike on 1/29/16.
 */
(function () {
    var app = angular.module("WebSlicer");

    app.directive('curasettings', function ($http, $rootScope) {

        var linker = function (scope, element, attrs) {
            // get the json file as specified by the directive
            $http.get(attrs.src).success(function (data) {
                // register all settings
                if (!$rootScope.settingsTracker) {
                    $rootScope.settingsTracker = {};
                }
                $rootScope.settingsTracker[attrs.src] = data;

                scope.settings = data; // bind data to a local scope that we can reference easily
            });
        };

        return {
            restrict: 'E',
            link: linker,
            templateUrl: "model/profile/settingsDirectiveTemplate.html",
            scope: {
                src: '='
            }
        };
    });

})();