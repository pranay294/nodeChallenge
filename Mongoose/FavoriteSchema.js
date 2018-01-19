var mongoose = require('mongoose');

// Initialize the schema to be used to store enteries
var favoriteSchema = mongoose.Schema({
    name: { type: String, required: true },
    list: { type: Array, required: true }
});

module.exports = mongoose.model('Favorite', favoriteSchema);