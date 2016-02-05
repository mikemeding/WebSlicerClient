/**
 * Created by mike on 2/3/16.
 */
(function () {
    'use strict';

    var app = angular.module("WebSlicer");

    app.service('TestSettingsDataService', ['ModalService', '$http', function (ModalService, $http) { // bring in ModalService as a dependency (contains compiler)

        // submit functions
        this.addOnSubmit = function (data) {
            console.log(data);
        };
        this.editOnSubmit = function (data) {
            console.log(data);
        };

        // get and update model based on our json file
        var model = {};
        $http.get('model/profile/testSettings.json').success(function (data) {
            console.log(data);
            model.fields = data;

            // add the callback functions from above
            model.addModalSettings = {
                title: 'Add New Person',
                callback: this.addOnSubmit
            };
            model.editModalSettings = {
                title: 'Edit Person',
                callback: this.editOnSubmit
            };

            // compile model
            model = ModalService.compileModel(model);
        });


        // this method must be implemented to allow external access to your model
        this.getModel = function () {
            return model;
        };

    }]);
}());

