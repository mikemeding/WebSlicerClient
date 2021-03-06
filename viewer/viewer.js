/**
 * Created by mike on 3/10/16.
 */

// PRELIMINARY BROWSER SETUP
//(function () {
//    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
//        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
//    window.requestAnimationFrame = requestAnimationFrame;
//})();

var app = angular.module('WebSlicer');

app.controller('gcodeController', ['$rootScope','$scope', '$http', 'renderFactory', 'gcodeFactory', function ($rootScope ,$scope, $http, renderFactory, gcodeFactory) {
    $scope.test = "working";

    // define web worker
    var worker = new Worker('viewer/Worker.js'); // no error checking for this

    // define return listener for the worker
    var processMessage = function (e) {
        var data = e.data;
        switch (data.cmd) {
            case 'returnModel':
                console.log('returnModel');
                gcodeFactory.setModel(data.msg.model);

                worker.postMessage({
                        "cmd": "analyzeModel",
                        "msg": {}
                    }
                );
                break;
            case 'analyzeDone':
                console.log('analyzeDone');

                gcodeFactory.processAnalyzeModelDone(data.msg);
                renderFactory.doRender(gcodeFactory.getModel(), 0);

                //TODO: This needs to be figured out. Layers should start at 0 not 2....
                renderFactory.render(2, 0, 631);

                break;
            case 'returnLayer':
                console.log('returnLayer');
                gcodeFactory.processLayerFromWorker(data.msg);
                break;
            case 'returnMultiLayer':
                console.log('returnMultiLayer');
                gcodeFactory.processMultiLayerFromWorker(data.msg);
                break;
            case "analyzeProgress":
                console.log('progress: ' + data.msg.progress);
                break;
            default:
                console.log("default msg received" + data.cmd);
        }
    };
    worker.addEventListener('message', processMessage, false);


    // get test gcode file
    //$http({
    //    method: 'GET',
    //    url: 'viewer/balanced_die_version_2.gcode'
    //}).then(function success(resp) {
    //    console.log(resp);
    //
    //    // split all lines
    //    var lines = resp.data.split(/\n/);
    //
    //    // post lines to worker for parsing
    //    worker.postMessage({
    //        "cmd": "parseGCode",
    //        "msg": {
    //            gcode: lines,
    //            options: {
    //                firstReport: 5
    //            }
    //        }
    //    });
    //
    //    gcodeFactory.loadString(resp.data); // load basic string params (parse header)
    //
    //    delete lines; // be clean with our memory as these files are huge
    //
    //}, function fail(resp) {
    //    console.error(resp);
    //});


    $rootScope.render = function(gcodeString){
        // split all lines
        var lines = gcodeString.split(/\n/);

        // post lines to worker for parsing
        worker.postMessage({
            "cmd": "parseGCode",
            "msg": {
                gcode: lines,
                options: {
                    firstReport: 5
                }
            }
        });

        gcodeFactory.loadString(gcodeString); // load basic string params (parse header)

        delete lines; // be clean with our memory as these files are huge

    };

    // layer number and current progress
    $scope.layerNumber = 2;
    $scope.progress = 50;

    $scope.$watch('layerNumber', function (newValue, oldValue) {
        //console.log("layerNumber");
        //console.log("newValue:" + newValue + ", oldValue:" + oldValue);
        if (newValue) {
            renderFactory.render($scope.layerNumber, 0, $scope.progress);
        }
    });
    $scope.$watch('progress', function (newValue, oldValue) {
        //console.log("progress");
        //console.log("newValue:" + newValue + ", oldValue:" + oldValue);
        if (newValue) {
            renderFactory.render($scope.layerNumber, 0, $scope.progress);
        }
    });

}]);



