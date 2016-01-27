/**
 * Created by mike on 9/25/15.
 */
(function () {
    var app = angular.module("WebSlicer", ["ui.router"]);

    app.config(function appConfig($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("home");

        // states
        $stateProvider
            .state("home", {
                url: "/home",
                templateUrl: "public/index.html",
                controller: "TestController"
            });

    });

    app.config(['$compileProvider',
        function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
        }]);
})();
