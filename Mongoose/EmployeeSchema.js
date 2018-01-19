var mongoose = require('mongoose');
var validator = require('validator');

// Initialize the schema to be used to store enteries
var employeeSchema = mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    email: { type: String, required: true, unique : true },
    salary: Number
});

// Validate email address
employeeSchema.path('email').validate(function (value) {
        return validator.isEmail(value);
    }, 'Email is invalid');

module.exports = mongoose.model('Employee', employeeSchema);