var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

//Express app
var express = require("express");
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false  })
);

app.use(express.static(process.cwd() + "/public"));
//Require set up handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({    defaultLayout: "main"   }) );
app.set("view engine", "handlebars");

//connecting to MongoDB
//mongoose.connect("mongodb://localhost/scraped_news");
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/recipeScraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to Mongoose!");
});

var routes = require("./controller/controller.js");
app.use("/", routes);
//Create localhost port
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on PORT " + port);
});












//////////////////////////////////////////////////






// app.get("/scrape", function(req, res) {
//     axios.get("http://vegetariantimes.com/recipes/collection/vegan-entrees").then(function(response){
//         var $ = cheerio.load;

//         var results = [];
        
//         $("img").each(function(i, element) {

//             var title = $(element).attr("alt");
//             var image = $(element).attr("src");

//             db.scrapedData.create({
//                 title: title,
//                 image: image,
//             },
//                 function(err, inserted) {
//                     if (err) {
//                     // Log the error if one is encountered during the query
//                     console.log(err);
//                     }
//                     else {
//                     // Otherwise, log the inserted data
//                     console.log(inserted);
//                     }
//                 }
//             ).then(function(dbRecipe) {
//                 console.log(dbRecipe);
//         });      
//     // Send a "Scrape Complete" message to the browser
//     res.send("Scrape Complete");
//     });
// })

// // Retrieve data from the db
//  app.get("/", function(req, res) {

// //   // Find all results from the scrapedData collection in the db
// db.scrapedData.find({}, function(error, found) {
// //   Throw any errors to the console
//     if (error) {
//     console.log(error);
//      }
// //  If there are no errors, send the data to the browser as json
//    else {
//     console.log("should show")
//     res.render("index", { recipes: found });
      
//    }
// });
  
//  });
//  })

//     // Listen on port 3000
//     app.listen(3000, function() {
//         console.log("App running on port 3000!");
//     });
