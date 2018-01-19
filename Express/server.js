/****************************
 * Include External Modules *
 ****************************/
var express = require('express');

var path    = require("path");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser())
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Handling get request on root URL -> Redirect to Web API Interface
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

function sendResponseToClient( obj, res ) {
    res.send( JSON.stringify(obj) );
    res.end();    
}

// Handling all HTTP requests on Employee
app.all('/Employee', function(req, res){
    console.log("New " + req.method + " request");
    var dbQuery = require("../Mongoose/EmployeeQueries");
    var query = new dbQuery();
    var cookie = req.cookies;

    // Success function for a DB query execution
    var successFunc = function(obj) {
        res.status(200);
        // Checking if auth cookie is present
        // If yes, logging to the output
        if( cookie.auth ) obj['cookie'] = cookie;
        sendResponseToClient( obj, res );
    };
    
    // Error function for a DB query execution
    var errorFunc = function(obj) {
        res.status(500);
        sendResponseToClient( obj, res );
    };

    if( ["GET", "POST", "PUT", "DELETE"].indexOf(req.method) === -1 ) {
        res.send("Invalid request method");
        res.end(); // Always end response
    }
    else {
        query.processRequest( req.method, successFunc, errorFunc, req.body );
    }
});

app.get("/Employee/:id", function(req, res){
    var dbQuery = require("../Mongoose/EmployeeQueries");
    var query = new dbQuery();
    var cookie = req.cookies;

    // Success function for a DB query execution
    var successFunc = function(obj) {
        res.status(200);
        // Checking if auth cookie is present
        // If yes, logging to the output
        if( cookie.auth ) obj['cookie'] = cookie;
        sendResponseToClient( obj, res );
    };
    
    // Error function for a DB query execution
    var errorFunc = function(obj) {
        res.status(500);
        sendResponseToClient( obj, res );
    };
    query.processRequest( "GET", successFunc, errorFunc, {"_id": req.params.id } );
});

// Handling all HTTP requests on Favorites
app.all('/Favorite', function(req, res){
    console.log("New " + req.method + " request for Favorites");
    var dbQuery = require("../Mongoose/FavoriteEmployeeQueries");
    var query = new dbQuery();
    var cookie = req.cookies;

    // Success function for a DB query execution
    var successFunc = function(obj) {
        res.status(200);
        // Checking if auth cookie is present
        // If yes, logging to the output
        if( cookie.auth ) obj['cookie'] = cookie;
        sendResponseToClient( obj, res );
    };
    
    // Error function for a DB query execution
    var errorFunc = function(obj) {
        res.status(500);
        sendResponseToClient( obj, res );
    };

    if( ["GET", "POST", "PUT", "DELETE"].indexOf(req.method) === -1 ) {
        res.send("Invalid request method");
        res.end(); // Always end response
    }
    else {
        query.processRequest( req.method, successFunc, errorFunc, req.body );
    }
});

// Express server to listen to port 3000
app.listen(3000);
console.log("Running at Port 3000");