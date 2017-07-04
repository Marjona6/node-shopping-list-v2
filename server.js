'use strict';

var express = require('express');
var router = express.Router();
var morgan = require('morgan');
var bodyParser = require('body-parser');

var _require = require('./models'),
    ShoppingList = _require.ShoppingList,
    Recipes = _require.Recipes;

var jsonParser = bodyParser.json();
var app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to ShoppingList
// so there's some data to look at
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);

// adding some recipes to `Recipes` so there's something
// to retrieve.
Recipes.create('boiled white rice', ['1 cup white rice', '2 cups water', 'pinch of salt']);
Recipes.create('milkshake', ['2 tbsp cocoa', '2 cups vanilla ice cream', '1 cup milk']);

// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/shopping-list', function (req, res) {
    res.json(ShoppingList.get());
});

app.post('/shopping-list', jsonParser, function (req, res) {
    // ensure `name` and `budget` are in request body
    var requiredFields = ['name', 'budget'];
    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        if (!(field in req.body)) {
            var message = 'Missing `' + field + '` in request body';
            console.error(message);
            return res.status(400).send(message);
        }
    }

    var item = ShoppingList.create(req.body.name, req.body.budget);
    res.status(201).json(item);
});

app.get('/recipes', function (req, res) {
    res.json(Recipes.get());
});

app.post('/recipes', jsonParser, function (req, res) {
    // ensure 'name'
    // and 'ingredients'
    // are in request body
    var requiredFields = ['name', 'ingredients'];
    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        if (!(field in req.body)) {
            var message = 'Missing `' + field + '` in request body';
            console.error(message);
            return res.status(400).send(message);
        }
    }

    var recipe = Recipes.create(req.body.name, req.body.ingredients);
    res.status(201).json(recipe);
});

app.listen(process.env.PORT || 8080, function () {
    console.log('Your app is listening on port ' + (process.env.PORT || 8080));
});
