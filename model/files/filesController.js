/**
 * Created by mike on 2/10/16.
 */
(function () {
    var app = angular.module("WebSlicer");

    app.controller("FilesController", ["$http", "$scope", "$rootScope", "OctoprintService", function ($http, $scope, $rootScope, OctoprintService) {

        // when the clientID changes we execute getting the file list
        $scope.$watch("$root.clientId", function (newValue, oldValue) {
            if (newValue !== "") {
                $scope.getFileList();
            }
        });

        /**
         * Get the list of flies associated with a client.
         */
        $scope.getFileList = function () {
            console.log($rootScope.clientId);
            $http({
                method: 'GET',
                url: $rootScope.baseUrl + "/getFiles/" + $rootScope.clientId
            }).then(function successCallback(response) {
                console.log(response);
                $scope.modelFiles = response.data;

                // print out all of the files
                for (var key in $scope.modelFiles) {
                    if ($scope.modelFiles.hasOwnProperty(key)) {
                        console.log(key + " -> " + $scope.modelFiles[key]);
                    }
                }
            }, function errorCallback(response) {
                console.error(response);
            });
        };

        /**
         * change the working file that we are slicing with.
         */
        $scope.changeWorkingFile = function (modelId) {
            console.log(modelId);
            $scope.modelFileId = modelId;
        };

        /**
         * Fire off a file upload of a MIME type MODEL file.
         */
        $scope.uploadFile = function () {
            var file = $scope.myFile;
            console.log('file is ');
            console.dir(file);
            var uploadUrl = $rootScope.baseUrl + "/importStl/" + $rootScope.clientId;
            var fd = new FormData();

            fd.append('file', file);
            $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function (response) {
                    //console.log(response);
                    $scope.modelFileId = response.fileId;
                    console.log($scope.modelFileId);
                    $scope.getFileList(); // refresh the file list
                })
                .error(function () {
                });


            //$scope.modelFileId = fileUpload.uploadFileToUrl(file, uploadUrl);
        };


    }]);


})();
