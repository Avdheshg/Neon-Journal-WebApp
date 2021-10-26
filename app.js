/*
   
*/

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');

// --------     Mongoose    --------
// Connecting
mongoose.connect("mongodb://localhost:27017/JournalDB");

// Defining Schema
const JournalDBSchema = new mongoose.Schema({
    tag: String,
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    textArea: {
        type: String,
        required: [true, "Description is required"]
    },
    date: String
});

// Defining a new model or DB
const Journal = mongoose.model("Journal", JournalDBSchema);

// Using Lodash for URL

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
// const j1Tag = "Wisdom";
// const j1Title = "Wisdom";
// const j1Description = `In Japan we have the phrase shoshin, which means "beginner's
// mind." The goal of practice is always to keep our
// beginner's mind. Suppose you recite the Prajna Paramita
// Sutra only once. It might be a very good recitation. But what
// would happen to you if you recited it twice, three times, four
// times, or more? You might easily lose your original attitude
// towards it. The same thing will happen in your other Zen
// practices. For a while you will keep your beginner's mind,
// but if you continue to practice one, two, three years or more,
// although you may improve some, you are liable to lose the
// limitless meaning of original mind.`
// const j1DayTime = "August 17, 2021, 04:58 PM";

// const journal1 = {
//     journalTags: j1Tag,
//     title: j1Title,
//     textArea: j1Description,
//     time: j1DayTime  
// }


// const noteBook = [ journal1 ];
// const noteBookHTML;

// Adding default items to DB
// const j1Tag = "Wisdom";
// const j1Title = "Wisdom";
// const j1Description = `In Japan we have the phrase shoshin, which means "beginner's
// mind." The goal of practice is always to keep our
// beginner's mind. Suppose you recite the Prajna Paramita
// Sutra only once. It might be a very good recitation. But what
// would happen to you if you recited it twice, three times, four
// times, or more? You might easily lose your original attitude
// towards it. The same thing will happen in your other Zen
// practices. For a while you will keep your beginner's mind,
// but if you continue to practice one, two, three years or more,
// although you may improve some, you are liable to lose the
// limitless meaning of original mind.`
// const j1DayTime = "August 17, 2021, 04:58 PM";

// const defaultJournal = new Journal({
//     tag: j1Tag,
//     title: j1Title,
//     textArea: j1Description,
//     date: j1DayTime
// });

let filterActive = false;
let activeTag = "All";

// Set up Route for the Home page
app.get("/", function(req, res) {

    if (!filterActive) {
        Journal.find({}, (err, foundItems) => {
            if (foundItems.length == 0) {
                // defaultJournal.save();
                res.send("<p>No Journal left")
            } else {
                res.render('index', {noteBookHTML: foundItems});
            }
        });
    } else {
        filterActive = false;
        // console.log("Active tag : " + activeTag);
        Journal.find({tag: activeTag}, function(err, journals) {
            res.render('post', {noteBookHTML: journals});
        });
    }
});

// For delete btn
app.post("/delete", function(req, res) {
    
    const deleteBtn = req.body.delete;
    // console.log(deleteBtn);

    Journal.deleteOne({_id: deleteBtn}, function(err) {
        if (!err) {
            console.log("Deleted");
        }
    });

    res.redirect("/");
});

// --- For Edit functionality ------
let id = undefined;
// const toUpdateJournal = [];
let arr = [];

// Setting route for new.ejs
app.get("/new", function(req, res) {
    
    if (id !== undefined) {

        console.log("In new get() Array is ");
        // console.log(toUpdateJournal);
        console.log(arr);
    } else {

        console.log("What");
    }

    res.render('new', {foo: 'FOO'});

    // res.redirect("/");
});

// let title = "";
app.post("/new", function(req, res) {
    
    const dayTime = dayTimeModule.date();
    
    id = req.body.toEdit;
    console.log("After  ID " + id);
    
    if (id !== undefined) {
        
        // Not able to put in the array
        Journal.findOne({_id: id}, function(err, journal) {
            console.log("Journal found\n" + journal._id);
            // console.log(journal.title);
            console.log("1");

            // toUpdateJournal.push(journal._id, journal.tag, journal.title, journal.textArea);
            // toUpdateJournal.push(journal._id);
            const uID = journal._id;
            console.log(uID);
            arr.push(uID);
            arr.push("hello array");

            // console.log(toUpdateJournal);
        });

        console.log("2 ");

    }
    
    if (id !== undefined) {
        console.log("3 ");
        res.redirect("/new");
    }
    
    const lodashTitle = _.trim(req.body.title);

    const journal = new Journal({
        tag: req.body.tagValue,
        title: lodashTitle,
        textArea: req.body.page,
        date: dayTime
    }); 

    // journal.save();

    // res.redirect("/");



    // Correct  -----
    // const lodashTitle = _.trim(req.body.title);

    // const journal = new Journal({
    //     tag: req.body.tagValue,
    //     title: lodashTitle,
    //     textArea: req.body.page,
    //     date: dayTime
    // }); 

    // saving to the DB
    // journal.save();

    // res.redirect("/");
    // -----
});

app.get("/demo", function(req, res) {
    res.send("<p> Hello there! ");
});

// Setting route parameter
app.get("/:values", function(req, res) {
    // console.log(req.params.values);

    enteredVal = _.capitalize(req.params.values);

    filterActive = true;
    activeTag = enteredVal;
    res.redirect("/");
    
});

app.get("/added/:title", function(req, res) {
    
    const titleEntered = _.trim(req.params.title);
    
    // console.log("title =>" + req.params.title + ". ");
    // console.log("titleEntered =>" + titleEntered + ". ");

    // Find the matched Journal from DB
    Journal.findOne({title: titleEntered}, function(err, journal) {
        console.log(journal);
        console.log(journal.textArea);
        res.render("added", {journalHTML: journal});
    });

});


// Set up server
app.listen(3000, function() {
    console.log("Server is running on port 3000");
})



/*
    
  

*/


















