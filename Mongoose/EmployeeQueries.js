/****************************
 * Include External Modules *
 ****************************/
var mongoose = require('mongoose');
var employee = require("./EmployeeSchema");

(function DbQueries(){
    "use strict";

    /*****************************************************
     * @description    Handle all uncaught exceptions    *
     *                 Used Arrow function               *
     *                 Disconnect db connection          *
     * @param          {err} Object - Error Object       *
     *****************************************************/
    process.on('uncaughtException', (err) => {
        console.log("Exception occured: ", err);
        mongoose.disconnect();
    });

    /*****************************************************
     * @description    Main class to handle all queries  *
     * @param          None                              *
     * @returns        AllQueries class                  *
     *****************************************************/
    var AllQueries = function() {
        mongoose.connect('mongodb://localhost/employee');        
        var dbConnection = mongoose.connection;
        
        /*****************************************************
         * @description    Initialize the database object    *
         * @param          None                              *
         *****************************************************/
        var initializeRequest = function( errorCallback ) {
            dbConnection.on('error', function() {
                errorCallback (
                    handleUnwantedRequest( "Connection error", "Unable to establish connection to DB" )
                );
            });
        };

        /**********************************************************
         * @description    Get Request / Select query on DB       *
         * @param          {db} Object - DB Connection obj        *
         * @param          {successCallback} Callback for success *
         * @param          {errorCallback} Callback for error     *
         * @param          {filter} String - Filter applied       *
         **********************************************************/
        var getRequest = function(db, successCallback, errorCallback, filter) {
            filter = filter || {};
            db.once('open', function() {
                employee.find(filter, function (err, emp) {
                    var response = {};
                    mongoose.disconnect();
                    if (err) {
                        errorCallback( handleUnwantedRequest("Data Error", err) );
                    }
                    else {
                        successCallback({"Users": emp});
                    }
                });
            });
        };

        /**********************************************************
         * @description    Post Request / Add entry query on DB   *
         * @param          {db} Object - DB Connection obj        *
         * @param          {successCallback} Callback for success *
         * @param          {errorCallback} Callback for error     *
         * @param          {data} Object - Data to be posted      *
         **********************************************************/        
        var postRequest = function(db, successCallback, errorCallback, data) {
            db.once('open', function() {
                var emp = new employee(data);
                employee.find({email: data.email}, function (err, em) {
                    if ( err ) {
                        errorCallback( handleUnwantedRequest("Database Error", err ) );
                    }
                    else {
                        if ( em.length === 0 ) {
                            emp.save(function (err, thisEmp) {
                                var response = {};
                                mongoose.disconnect();
                                if (err) {
                                    errorCallback( handleUnwantedRequest("Data Error", err) );
                                }
                                else {
                                    successCallback({"Message": "Successfully Added", "User": thisEmp});
                                }  
                            });
                        }
                        else {
                            errorCallback( handleUnwantedRequest("Duplicate Entry", "Email " + data.email + " already registered") );
                        }
                    }
                });              
            });
        };
        
        /**********************************************************
         * @description    Patch Request / Update DB query        *
         * @param          {db} Object - DB Connection obj        *
         * @param          {successCallback} Callback for success *
         * @param          {errorCallback} Callback for error     *
         * @param          {data} Object - Data to be patched     *
         **********************************************************/        
        var patchRequest = function(db, successCallback, errorCallback, data) {
            db.once('open', function() {
                employee.findOneAndUpdate(data.query, data.change, function (err, emp) {
                    mongoose.disconnect();
                    if (err) {
                        errorCallback( handleUnwantedRequest("Data Error", err) );
                    }
                    else {
                        successCallback({"Message": "Successfully Updated", "User": data.query});
                    }
                });
            });
        };

        /**********************************************************
         * @description    Delete Request / Delete DB entry       *
         * @param          {db} Object - DB Connection obj        *
         * @param          {successCallback} Callback for success *
         * @param          {errorCallback} Callback for error     *
         * @param          {data} Object - Data to be deleted     *
         **********************************************************/    
        var deleteRequest = function(db, successCallback, errorCallback, data) {
            db.once('open', function() {
                employee.find( data, function (err1, em) {
                    if ( err1 ) {
                        errorCallback( handleUnwantedRequest("Database Error", err1 ) );
                    }
                    else {
                        if ( em.length !== 0 ) {
                            employee.remove(data, function (err, emp) {
                                mongoose.disconnect();
                                if (err) {
                                    errorCallback( handleUnwantedRequest("Data Error", err) );
                                }
                                else {
                                    successCallback({"Message": "Successfully Deleted", "User": data});
                                }
                            });     
                        }
                        else {
                            errorCallback( handleUnwantedRequest("Invalied User", "User " + data.email + " does not exist") );
                        }
                    }
                });
            });
        };

        /**********************************************************
         * @description    Create error object                    *
         * @param          {errorType} String - Error type        *
         * @param          {error} String - Error description     *
         * @param          {err} Object - Error object            *
         **********************************************************/
        var handleUnwantedRequest = function(errorType, error) {
            return { type: errorType, errorMsg : error };
        };

        /**********************************************************
         * @description    Process database request               *
         * @param          {requestType} String - Request type    *
         * @param          {successCallback} Callback for success *
         * @param          {errorCallback} Callback for error     *
         * @param          {data} object - Data to be posted      *
         **********************************************************/
        this.processRequest = function(requestType, successCallback, errorCallback, data) {
            initializeRequest( errorCallback );
            switch(requestType) {
                case "GET" :
                    getRequest(dbConnection, successCallback, errorCallback, data);
                    break;
                case "POST" :
                    postRequest(dbConnection, successCallback, errorCallback, data);
                    break;
                case "PUT" :
                    patchRequest(dbConnection, successCallback, errorCallback, data);
                    break;
                case "DELETE" :
                    deleteRequest(dbConnection, successCallback, errorCallback, data);
                    break;
                default :
                    errorCallback(
                        handleUnwantedRequest(
                            "Unidentified request type", 
                            requestType + "is not a valid request")
                    );
            }
        } ;
    };
    
    module.exports = AllQueries;
})();