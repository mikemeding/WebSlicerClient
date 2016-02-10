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
    app.controller('CuraSettingsController', ['$scope', '$http', function ($scope, $http) {

        console.log($scope.content)

    }]);

    app.directive('curasettings', function ($compile) {

        //var getItemTemplate = function (setting) {
        //    var item = "";
        //    var itemName = setting.setting;
        //    var label = setting.label;
        //    var type = setting.type;
        //    var defaultSetting = setting.default;
        //
        //    switch (type) {
        //        case "float":
        //            item = "<label for=\"" + itemName + "\">" + label + "</label>";
        //            item = item + "<input value=\'" + defaultSetting + "\' type=\"number\" class=\"form-control\" id=\"" + itemName + "\">";
        //            break;
        //        case "int":
        //            item = "<label for=\"" + itemName + "\">" + label + "</label>";
        //            item = item + "<input type=\"number\" class=\"form-control\" id=\"" + itemName + "\">";
        //            break;
        //        case "bool":
        //            item = "<label><input type=\"checkbox\"> " + label + "</label>";
        //            break;
        //        case "list":
        //            break;
        //    }
        //    return "<div class=\"form-group\">" + item + "</div>";
        //};

        var linker = function (scope, element, attrs) {
            console.log(attrs.settings);
            //$http.get(attrs.content).success(function (data) {
            //    console.log(data);
            //});

            //element.html(getItemTemplate(scope.content)).show();
            //$compile(element.contents())(scope);
        };

        return {
            restrict: 'E',
            link: linker,
            scope: {
                settings: '='
            }

        };
    });

})();