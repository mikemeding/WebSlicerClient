/**
 * Created by mike on 9/25/15.
 */
(function () {
    var app = angular.module("WebSlicer", []);
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

    app.service('fileUpload', ['$http', function ($http) {
        this.uploadFileToUrl = function (file, uploadUrl) {
            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(function () {
                })
                .error(function () {
                });
        }
    }]);

    app.controller("TestController", ["$http", "$scope", "fileUpload", function ($http, $scope, fileUpload) {
        $scope.title = "Web Slicer";

        $scope.dataHere = false;

        $scope.ping = function () {
            $http({
                method: 'GET',
                //url: 'http://' + $scope.address + ':' + $scope.port + '/api/printer',
                url: 'http://' + $scope.address + '/api/printer',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': $scope.apiKey
                }
            }).then(function successCallback(response) {
                console.log(response);
                $scope.data = response.data;
                $scope.dataHere = true;
            }, function errorCallback(response) {
                console.error(response);
            });
        };

        $scope.uploadFile = function () {
            var file = $scope.myFile;
            console.log('file is ');
            console.dir(file);
            var uploadUrl = "http://localhost:8080/WebSlicer/slicer/importFile";
            fileUpload.uploadFileToUrl(file, uploadUrl);
        };

    }]);
})();