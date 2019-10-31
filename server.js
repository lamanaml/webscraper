var cheerio = require("cheerio");
var axios = require("axios");
var mongojs = require("mongojs");
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var PORT = process.env.PORT || 3002;


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var db = require("./models");
// app.use(express.static("public"));
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoVegTimes";

mongoose.connect(MONGODB_URI, err => {
    if(err) {
        console.log("You have an error" + err);
    } else {
        console.log("You are connected to Mongoose");
    }
});


// Database configuration
var databaseUrl = "vegtimes";
var collections = ["recipes"]; 

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections); 
db.on("error", function(error) {
 console.log("Database Error:", error);
});

// Main route 


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

// Retrieve data from the db
app.get("/", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      console.log("should show")
      res.render("index", { recipes: res });
    }
  });
});


    // Listen on port 3000
    app.listen(3002, function() {
        console.log("App running on port 3002!");
    });

