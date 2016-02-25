var Ingredient = require('../ingredients/ingredientController.js');
var User_Recipe = require('../user_recipe/user_recipeModel.js');
var Recipe = require('./recipeModel.js');
var env = require('../env/env.js');
var api_key = env.api_key;
var request = require('request');
var findByIngredients = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients';
var findRecipeDetails = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/';
var Q = require('q');

//var findUser_Recipe = Q.nbind(User_Recipe.find, User_Recipe);
//var createUser_Recipe = Q.nbind(User_Recipe.create, User_Recipe);
var createRecipe = Q.nbind(Recipe.create, Recipe);
var findRecipe = Q.nbind(Recipe.find, Recipe);

module.exports = {
  //Make temp functionality for non-logged in users?
  tempGetRecipes: function(req, res, next) {
    var options = {
      url: findByIngredients,
      headers: {
        'X-Mashape-Key': api_key
      },
      qs: {ingredients: Ingredient.getAllIngredients()}
    };
    request.get(options, function (error, response, body) {
      if (error) {
        console.log("Error with getRecipes request:", error);
      } else {
        res.end(body);
      }
    });
  },

  getRecipes: function (req, res, next) {
    var email = req.user.email;
    Ingredient.getAllIngredients( email, function( cart ){
      var ingredients = cart.ingredients.join();
      var options = {
        url: findByIngredients,
        headers: {
          'X-Mashape-Key': api_key
        },
        qs: {ingredients: ingredients}
      };
      request.get(options, function (error, response, body) {
        if (error) {
          console.log("Error with getRecipes request:", error);
        } else {
          console.log('special recipes for a@a.com cart: ', body);
          res.end(body);
        }
      });
    });
  },

  getSavedRecipes: function( req, res, next ){
    var email = req.user.email;
    // find recipes specific to the user
    findRecipe({email: email})
    .then(function( found ){
      // iterate through found here? It will probably be an array of all fields 
      // that include that user email, since a user can have many saved recipes
      console.log('getSavedRecipes returns this =================>>>>>>>>>>>', found);
        //collect all recipe_id fields
      //search recipes collection and return all recipes with matching id's
      res.send(200, found);
    })
    .fail(function (err) {
      res.send(500, err);
    })
  },

  saveRecipe: function( req, res, next ) {
    var recipe = req.body.recipe;
    var email = req.user.email;
    // create recipe entry to save
    var entry = {
      title: recipe.title,
      id: recipe.id,
      email: email
    };
    console.log('e: ', entry);
    //Save recipe to Recipe
    createRecipe(entry)
    .then(function ( recipe ) {
      res.send(200, recipe);
    })
    .fail(function ( err ){
      res.send(500, err);
    });
  },

  getRecipeDetails: function( req, res, next ) {
    var id = req.body.id;
    console.log('req id================>>>', id);
    var options = {
      url: findRecipeDetails + id + '/information',
      headers: {
        'X-Mashape-Key': api_key
      }
    };
    request.get(options, function (error, response, body) {
      if (error) {
        console.log("Error with getRecipeDetails request:", error);
      } else {
        console.log('Detailed recipe request==========>>>>>: ', body);
        res.end(body);
      }
    });
  }

};