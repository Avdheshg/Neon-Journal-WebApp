const express = require("express");
const bodyParser = require("body-parser");

// Using Lodash for URL
const _ = require('lodash');

// let unique = _.lowerCase("hElLO uRl");
// let unique = _.lowerCase("heeloBAr");
// console.log(unique);

const app = express();

// Importing the time module
const dayTimeModule = require(__dirname + "/dayTime.js");

// Use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Using CSS
app.use(express.static("public"));

// Using EJS
app.set('view engine', 'ejs');

// Main array for storing all Journals
const j1Title = "Wisdom";
const j1Tag = "Wisdom";
const j1Description = `In Japan we have the phrase shoshin, which means "beginner's
mind." The goal of practice is always to keep our
beginner's mind. Suppose you recite the Prajna Paramita
Sutra only once. It might be a very good recitation. But what
would happen to you if you recited it twice, three times, four
times, or more? You might easily lose your original attitude
towards it. The same thing will happen in your other Zen
practices. For a while you will keep your beginner's mind,
but if you continue to practice one, two, three years or more,
although you may improve some, you are liable to lose the
limitless meaning of original mind.`
const j1DayTime = "August 17, 2021, 04:58 PM";

const journal1 = {
    journalTags: j1Tag,
    title: j1Title,
    textArea: j1Description,
    time: j1DayTime  
}


const noteBook = [ journal1 ];
// const noteBookHTML;


// Set up Route for the Home page
app.get("/", function(req, res) {
    // res.sendFile(__dirname +  "/index.html");

    // Sending the EJS file
    // res.render('index', {noteBookHTML: noteBook});
    res.render('index', {noteBookHTML: noteBook});
});

// Setting route for new.ejs
app.get("/new", function(req, res) {
    res.render('new', {foo: 'FOO'});

    // res.redirect("/");
});

// let title = "";
app.post("/new", function(req, res) {
    
    // For storing the current journal
    // const page = [];     // 2
    
    // Extracting the data entered   1
    // const journalTags = req.body.tagValue;
    // const title = req.body.title;
    // const textArea = req.body.page;

    const dayTime = dayTimeModule.date();

    // Extracting the data entered and adding to the Object
    const page = {
        journalTags: req.body.tagValue,
        title: req.body.title,
        textArea: req.body.page,
        time: dayTime
    }

    // const bgImg = req.body.bg-img;
    // console.log(bgImg);     3
    // console.log("Text entered : " + page.textArea);
    // console.log("Title : " + page.title);
    // console.log("Journal tag values : " + page.journalTags);

    
    console.log("Text entered : " + page.textArea);
    console.log("Title : " + page.title);
    console.log("Journal tag values : " + page.journalTags);


    // page.push(journalTags, title, textArea, dayTime);    // 4  5 EJS file  6 noteBook[]

    noteBook.push(page);

    res.redirect("/");
});

app.get("/demo", function(req, res) {
    res.send("<p> Hello there! ");
});

// Setting route parameter
app.get("/:values", function(req, res) {
    console.log(req.params.values);

    enteredVal = _.lowerCase(req.params.values);

    noteBook.forEach(function(page) {
        const pageTitle = _.lowerCase(page.title);
        if (pageTitle === enteredVal) {

            const pageInfo = {
                pageTitle: page.title,
                enteredVal: page.textArea
            }

            console.log("Match Found");
            res.render('post', {pageInfoHTML: pageInfo});
        }
    })
    
});


// Set up server
app.listen(3000, function() {
    console.log("Server is running on port 3000");
})

















/*
    
    <% for (let i = 0; i < noteBookHTML.length; i++) {   %>

            <section class="card">

                <p class="tag">  <%= noteBookHTML[i][0] %>   </p>
                <h1>   <%= noteBookHTML[i][1] %>   </h1>
                <p>   <%= noteBookHTML[i][2] %>   </p>
    
                <section class="day-time">
                    <i class="fa-solid fa-clock"></i>
                    <%= noteBookHTML[i][3] %>   
                </section>

            </section>

    <%  }  %>

*/


















