/**
 * Created by mike on 1/29/16.
 */
(function () {
    var app = angular.module("WebSlicer");

    app.directive('curasetting', function ($compile) {
        //{
        //    "setting": "layer_height",
        //    "default": 0.1,
        //    "type": "float",
        //    "category": "Quality",
        //    "label": "Layer Height (mm)",
        //    "description": "Layer height in millimeters.\nThis is the most important setting to determine the quality of your print. Normal quality prints are 0.1mm, high quality is 0.06mm. You can go up to 0.25mm with an Ultimaker for very fast prints at low quality."
        //}

        var getTemplate = function (setting) {
            var item = "";
            var itemName = setting.setting;
            var label = setting.label;
            var type = setting.type;

            switch (type) {
                case "float":
                    item = "<label for=\"" + itemName + "\">" + label + "</label>";
                    item = item + "<input ng-model='setting.default' type=\"number\" class=\"form-control\" id=\"" + itemName + "\">";
                    break;
                case "int":
                    item = "<label for=\"" + itemName + "\">" + label + "</label>";
                    item = item + "<input type=\"number\" class=\"form-control\" id=\"" + itemName + "\">";
                    break;
                case "bool":
                    item = "<label><input type=\"checkbox\"> " + label + "</label>";
                    break;
                case "list":
                    break;
            }
            return "<div class=\"form-group\">" + item + "</div>";
        };

        var linker = function (scope, element, attrs) {
            console.log(attrs);
            console.log(scope.content);
            console.log(getTemplate(scope.content));
            element.html(getTemplate(scope.content)).show();
            $compile(element.contents())(scope);
        };

        return {
            restrict: 'E',
            link: linker,
            scope: {
                content: '='
            }
        };
    });

})();