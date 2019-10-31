var cheerio = require("cheerio");
var axios = require("axios");
var mongojs = require("mongojs");
var express = require("express");
var app = express();

// Database configuration
var databaseUrl = "vegtimes";
var collections = ["recipes"]; 

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

app.get("/scrape", function(req, res) {
    axios.get("http://vegetariantimes.com/recipes/collection/vegan-entrees").then(function(response){
        var $ = cheerio.load(response.data);
        $("img").each(function(i, element) {
            var title = $(element).attr("alt");
            var image = $(element).attr("src");
            db.scrapedData.insert({
                title: title,
                image: image,
                },
                function(err, inserted) {
                    if (err) {
                    // Log the error if one is encountered during the query
                    console.log(err);
                    }
                    else {
                    // Otherwise, log the inserted data
                    console.log(inserted);
                    }
                }
            );   
        });      
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
    });
})


    // Listen on port 3000
    app.listen(3000, function() {
        console.log("App running on port 3000!");
    });

// //Route for getting all Articles from the db
// // app.get("/recipes", function(req, res) {
// //   // Grab all recipes
// //   db.Recipe.find({})
// //     .then(function(dbRecipe) {
// //       // If we were able to successfully find Articles, send them back to the client
// //       res.json(dbRecipe);
// //     })
// //     .catch(function(err) {
// //       // If an error occurred, send it to the client
// //       res.json(err);
// //     });
// // })