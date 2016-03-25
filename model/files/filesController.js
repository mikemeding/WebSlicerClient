/**
 * Created by mike on 2/10/16.
 */
(function () {
    var app = angular.module("WebSlicer");

    app.controller("FilesController", ["$http", "$scope", "$rootScope", "Upload", "OctoprintService", function ($http, $scope, $rootScope, Upload, OctoprintService) {

        $scope.modelFileId = '';

        $scope.logMe = function (item) {
            console.log(item);
        };

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
                //console.log(response);
                $scope.modelFiles = [];
                for (var key in response.data) {
                    if (response.data.hasOwnProperty(key)) {
                        $scope.modelFiles.push({"key": key, "value": response.data[key]});
                    }
                }

            }, function errorCallback(response) {
                console.error(response);
            });
        };


        /**
         * Fire off a file upload of a MIME type MODEL file.
         */
            //$scope.uploadFile = function () {
            //    var file = $scope.myFile;
            //    console.log('file is ');
            //    console.dir(file);
            //    var uploadUrl = $rootScope.baseUrl + "/importStl/" + $rootScope.clientId;
            //    var fd = new FormData();
            //
            //    fd.append('file', file);
            //    $http.post(uploadUrl, fd, {
            //            transformRequest: angular.identity,
            //            headers: {'Content-Type': undefined}
            //        })
            //        .success(function (response) {
            //            //console.log(response);
            //            $scope.modelFileId = response.fileId;
            //            console.log($scope.modelFileId);
            //            $scope.getFileList(); // refresh the file list
            //        })
            //        .error(function () {
            //        });
            //
            //};


            // upload on file select or drop
        $scope.uploadFile = function (file, errFiles) {
            var uploadUrl = $rootScope.baseUrl + "/importStl/" + $rootScope.clientId;
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];

            if (file) {
                file.upload = Upload.upload({
                    url: uploadUrl,
                    data: {data: file}
                });

                file.upload.then(function (response) {

                    //$scope.modelFileId = response.fileId;
                    //console.log($scope.modelFileId);
                    $scope.getFileList(); // refresh the file list

                }, function (response) {
                    if (response.status > 0)
                        $rootScope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
        };



    }]);


})();
