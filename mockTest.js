
var accuracy = 0;
var allTests = [
    {
        Name : "Get Employee", Method : "GET", expected : "PASS"
    },
    { Name : "Add Employee", Method : "POST", expected : "PASS", Data : { 
        name : "Pranay", email : "pranay@marlabs.com", salary : 1000, designation: "Manager"
        } 
    },
    { Name : "Update Employee", expected : "PASS", Method : "PUT", Data : { 
        query: { email : "pranay@marlabs.com" },
        change: { email : "pranay@marlabs.com", name: "Pranay Ranjan", designation: "Manager", salary: 500 }
        } 
    },
    {
        Name : "Delete Employee", expected : "PASS", Method : "DELETE", Data : { email : "pranay@marlabs.com" }
    },
    { Name : "Incorrect email format", expected : "FAIL", Method : "POST", Data : { 
        name : "Pranay", email : "pranaymarlabs.com", salary : 1000, designation: "Manager"
        } 
    },
    { Name : "No email", expected : "FAIL", Method : "POST", Data : { 
        name : "Pranay", salary : 1000, designation: "Manager"
        } 
    },
    { Name : "No Name", expected : "FAIL", Method : "POST", Data : { 
        email : "pranaymarlabs.com", salary : 1000, designation: "Manager"
        } 
    },
];
var totalTests = allTests.length;

function runTest(allTests) {
    if( allTests.length ) {
        var test = allTests[0];
        console.log( "************************************");
        console.log(test.Name, " :");
        var empQuery = require("./Mongoose/EmployeeQueries");
        var empQueryObj = new empQuery();
        var successFunc = function(obj) {
            console.log( test.Name + " : ");
            console.log( "Expected: ", test.expected );
            console.log( "Actual: " , "PASS" );
            if( "PASS" === test.expected ) accuracy++;
            allTests.shift();
            runTest( allTests );
        };
        var errFunc = function( obj ) {
            console.log( test.Name + " : ");
            console.log( "Expected: ", test.expected );
            console.log( "Actual: " , "FAIL" );
            console.log( obj );
            if( "FAIL" === test.expected ) accuracy++;
            allTests.shift();
            runTest( allTests );
        };
        empQueryObj.processRequest(
            test.Method,
            successFunc,
            errFunc,
            test.Data
        );
    }
    else {
        console.log( "************************************");
        console.log( accuracy , " of ", totalTests, " tests behaved correctly");
    }
};

runTest( allTests );
