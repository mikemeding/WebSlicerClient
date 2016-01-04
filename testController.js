/**
 * Created by mike on 9/25/15.
 */
(function () {
    var app = angular.module("WebSlicer", []);
    app.controller("TestController", ["$http", "$scope", function ($http, $scope) {
        $scope.title = "Web Slicer";

        $scope.dataHere = false;

        $scope.ping = function () {
            $http({
                method: 'GET',
                url: 'http://' + $scope.address + ':' + $scope.port + '/api/printer',
                headers: {
                    'Content-Type':'application/json',
                    'x-api-key':$scope.apiKey
                }
            }).then(function successCallback(response) {
                console.log(response);
                $scope.data = response.data;
                $scope.dataHere = true;
            }, function errorCallback(response) {
                console.error(response);
            });
        }


    }]);
})();