var cheerio = require("cheerio");
var axios = require("axios");

axios.get("http://vegetariantimes.com/recipes/collection/vegan-entrees").then(function(response){
    var $ = cheerio.load(response.data);
    var results = [];

    $("a.m-card--image-link").each(function(i, element) {

    var title = $(element).attr("title");
    var img = $(element).children().attr("type");
    //var desc = $(element).attr("desc");
    var link = $(element).attr("href");
    
    
    results.push({
        title: title,
       // desc: desc,
        img: img,
        link: link
        });
});

console.log(results);

});



// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect(MONGODB_URI);