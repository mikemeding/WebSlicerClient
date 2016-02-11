/**
 * Created by mike on 2/10/16.
 */
(function () {
    var app = angular.module("WebSlicer");

    app.directive('filecontrols', function () {
        return {
            restrict: 'E',
            templateUrl: 'model/files/filesTemplate.html'
        };
    });

})();