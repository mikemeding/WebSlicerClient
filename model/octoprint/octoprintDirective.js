/**
 * Created by mike on 1/29/16.
 */
(function () {
    var app = angular.module("WebSlicer");

    app.directive('octoprint', function () {
        return {
            restrict: 'E',
            templateUrl: 'model/octoprint/octoprintTemplate.html'
        };
    });

})();