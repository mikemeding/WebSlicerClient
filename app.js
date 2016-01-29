/**
 * Created by mike on 9/25/15.
 */
(function () {
    var app = angular.module("WebSlicer", ["ui.router"]);

    app.config(["$stateProvider", "$urlRouterProvider", "$controllerProvider", "$compileProvider", function appConfig($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider) {
        // default route
        $urlRouterProvider.otherwise("home");

        // states
        $stateProvider
            .state("home", {
                url: "/home",
                templateUrl: "public/index.html"
            });

        // controller config
        $controllerProvider.allowGlobals();

        // post compile config
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }]);

})();
