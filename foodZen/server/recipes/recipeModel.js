var mongoose = require('mongoose');

var recipeSchema = mongoose.Schema({
    id: Number,
    title: String,
    email: String
});

var Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;



