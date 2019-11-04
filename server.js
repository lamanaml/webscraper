//var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// var logger = require("morgan");

//Express app
var express = require("express");
var app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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

var routes = require("./controller/controller.js");
app.use("/", routes);

//Create localhost port
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Listening on PORT " + PORT);
});












