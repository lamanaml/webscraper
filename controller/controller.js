var express = require("express");
var router = express.Router();
var path = require("path");

var request = require("request");
var cheerio = require("cheerio");

var Note = require("../models/Note.js");
var Recipe = require("../models/Recipe.js");

router.get("/", function(req, res) {
  res.redirect("/recipes");
});

router.get("/scrape", function(req, res) {
  request("http://vegetariantimes.com/recipes/collection/vegan-entrees", function(error, response, html) {
    var $ = cheerio.load(html);
    var titlesArray = [];

    $("img").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .attr("alt");
console.log(results.title)
      result.image = $(this)
        .attr("src");

      // result.link = $(this)
      //   .children("a")
      //   .attr("href");

      if (result.title !== "" && result.image !== "") {
        if (titlesArray.indexOf(result.title) == -1) {
          titlesArray.push(result.title);

          Recipe.count({ title: result.title }, function(err, test) {
            if (test === 0) {
              var entry = new Recipe(result);

              entry.save(function(err, doc) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(doc);
                }
              });
            }
          });
        } else {
          console.log("Recipe already exists.");
        }
      } else {
        console.log("Not saved to DB, missing data");
      }
    });
    res.redirect("/");
  });
});
router.get("/recipes", function(req, res) {
  Recipe.find()
    .sort({ _id: -1 })
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        var artcl = { recipe: doc };
        res.render("index", artcl);
      }
    });
});

router.get("/recipes-json", function(req, res) {
  Recipe.find({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

router.get("/clearAll", function(req, res) {
  Recipe.remove({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log("removed all recipes");
    }
  });
  res.redirect("/recipes-json");
});

router.get("/readRecipe/:id", function(req, res) {
  var recipeId = req.params.id;
  var hbsObj = {
    recipe: [],
    body: []
  };

  Recipe.findOne({ _id: recipeId })
    .populate("note")
    .exec(function(err, doc) {
      if (err) {
        console.log("Error: " + err);
      } else {
        hbsObj.recipe = doc;
        var link = doc.link;
        request(link, function(error, response, html) {
          var $ = cheerio.load(html);

          $(".l-col__main").each(function(i, element) {
            hbsObj.body = $(this)
              .children(".c-entry-content")
              .children("p")
              .text();

            res.render("recipe", hbsObj);
            return false;
          });
        });
      }
    });
});
router.post("/note/:id", function(req, res) {
  var user = req.body.name;
  var content = req.body.note;
  var recipeId = req.params.id;

  var noteObj = {
    name: user,
    body: content
  };

  var newNote = new Note(noteObj);

  newNote.save(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log(doc._id);
      console.log(recipeId);

      Recipe.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { note: doc._id } },
        { new: true }
      ).exec(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/readRecipe/" + recipeId);
        }
      });
    }
  });
});

module.exports = router;