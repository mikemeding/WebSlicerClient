/**
 * Created by mike on 9/25/15.
 */

// Libraries
var express = require('express');
var cors = require("cors");

// Express server setup
var app = express();
app.use(express.static(__dirname + "/app"));
app.use(cors());

// REST CALLS
app.get('/ping', function (req, res) {
    console.log('PING!');
    res.send("PONG!");
});

//Fire up node server
var port = 3000;
app.listen(port, function () {
    console.log("Server working on port: " + port);
});