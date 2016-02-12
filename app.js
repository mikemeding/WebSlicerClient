/**
 * Created by mike on 9/25/15.
 */
(function () {
    var app = angular.module("WebSlicer", ["ui.router", "ui.bootstrap", "ngAnimate"]);

    app.controller("Main", ["$http", "$scope", "$window", "$rootScope", function ($http, $scope, $window, $rootScope) {

        // the main servers base url for making REST calls
        $rootScope.baseUrl = "http://localhost:8080/WebSlicer/slicer";
        $rootScope.clientId = "";
        $rootScope.busy = false;

        // environment vars
        //$rootScope.baseUrl;
        $scope.title = "Web Slicer";
        $scope.displayOctoprintData = false;
        //$scope.clientId = "";
        $scope.modelFiles = {};
        $scope.gcode = {"gcode": ""};

        // make gcode available for download
        var blob = new Blob([$scope.gcode.gcode], {type: 'text/plain'});
        $scope.gcodeDownload = (window.URL || window.webkitURL).createObjectURL(blob);

        /**
         * Generate a new client id and layout all of the files for this new client on the server
         */
        $scope.generateClientId = function () {
            $http({
                method: 'POST',
                url: $rootScope.baseUrl + "/setupClient"
            }).then(function successCallback(response) {
                console.log(response);
                $rootScope.clientId = response.data.clientId;
            }, function errorCallback(response) {
                console.error(response);
            });
        };

        //DOWNLOAD GCODE FUNCTION
        $scope.downloadGcode = function (gcode) {
            var blob = new Blob([gcode], {type: "application/json;charset=utf-8;"});
            var downloadLink = angular.element('<a></a>');
            //var downloadLink = angular.element(elem.querySelector(".downloadGcode"));
            downloadLink.attr('href', window.URL.createObjectURL(blob));
            downloadLink.attr('download', 'output.gcode');
            downloadLink[0].click();

            //$window.open("data:application/json;charset=utf-8," + encodeURIComponent(gcode));
        };

        /**
         * The main slice function. This will only operate if the client has both uploaded a settings file and a model file.
         * Both of these files will be given an id that the client must track in order to slice a file properly.
         *
         * @param modelId
         * @param settingsId
         */
        $scope.slice = function (modelId) {
            if (modelId) {
                $rootScope.busy = true;

                // run import settings to update settings on server BEFORE SLICING
                $rootScope.importSettings()

                    .then(function successCallback(response) {
                        console.log(response);

                        // SEND SLICE REQUEST!
                        $http({
                            method: 'POST',
                            url: $rootScope.baseUrl + "/slice/" + $rootScope.clientId + "/" + modelId
                        }).then(function successCallback(response) {
                            // capture our gcode as a response.
                            console.log(response);
                            $scope.gcode = response.data;
                            $rootScope.busy = false;

                        }, function errorCallback(response) {
                            console.error(response);
                            $rootScope.busy = false;
                        });

                    }, function errorCallback(response) {
                        console.error(response);
                        console.error("import settings before slice");
                    });

            } else {
                console.error("model or settings id missing");
            }
        };
    }]);

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

    //TODO: this needs to go into its own file
    app.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
})();
