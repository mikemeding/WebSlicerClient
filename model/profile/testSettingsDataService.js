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
        //$http.get('model/profile/testSettings.json').success(function (data) {
        //    console.log(data);
        //    model.fields = data; // populate settings as soon as we get them
        //});
        model.fields = [
            {
                "name": "layer_height",
                "default": 0.1,
                "type": "text",
                "displayName": "Layer Height (mm)",
                "placeholder": "Layer height in millimeters.\nThis is the most important setting to determine the quality of your print. Normal quality prints are 0.1mm, high quality is 0.06mm. You can go up to 0.25mm with an Ultimaker for very fast prints at low quality."
            },
            {
                "name": "wall_thickness",
                "value": 0.8,
                "type": "number",
                "displayName": "Shell Thickness (mm)",
                "description": "Thickness of the outside shell in the horizontal direction.\nThis is used in combination with the nozzle size to define the number\nof perimeter lines and the thickness of those perimeter lines."
            },
            {
                "name": "retraction_enable",
                "active": true,
                "type": "checkbox",
                "displayName": "Enable Retraction"
            }
        ];

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


        // this method must be implemented to allow external access to your model
        this.getModel = function () {
            return model;
        };

    }]);
}());

