/*
   
*/

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');

const app = express();

// Importing the time module
const dayTimeModule = require(__dirname + "/dayTime.js");

// Use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Using CSS
app.use(express.static("public"));

// Using EJS
app.set('view engine', 'ejs');


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

// let filterActive = false;
// let activeTag = "All";
var isFilterEmpty = false;

// Set up Route for the Home page
app.get("/", function(req, res) {

    Journal.find({}, (err, foundItems) => {
        if (foundItems.length == 0) { 
            // defaultJournal.save();
            res.send("<p>No Journal left");
        } else {
            res.render('index', {noteBookHTML: foundItems, isFilterEmptyHTML: isFilterEmpty});
        }
    });
});


// --- For Edit functionality ------
let id = undefined;
// const toUpdateJournal = [];
let toEditArr = ["", "", ""];

// Setting route for new.ejs
app.get("/new", function(req, res) {
    console.log("In get() " );

    res.render("new", {toEditArrHTML: toEditArr});
});


// let title = "";
app.post("/new", function(req, res) {
    
    const dayTime = dayTimeModule.date(); 
    
    id = req.body.toEditID;
    // const myText = req.body.title;
    // console.log("upper Textarea " + myText);
    // console.log("to edit ID " + id);
    
    // added page(or Edit) has sent the ID, after user have clicked the edit btn
    if (id !== undefined) {
        
        console.log("Here from edit and the ID is " + id);
        
        Journal.findOne({_id: id}, function(err, journalFound) {
            if (err) {
                console.log(err);
            } else {
                console.log("Journal found => " + journalFound.title);                
                toEditArr[0] = journalFound.title;  
                toEditArr[1] = journalFound.textArea;
                toEditArr[2] = journalFound.date;

                console.log(toEditArr);
                res.redirect("/new"); 
            }
        });
    } else {
        console.log("array is reinitialised ");
        toEditArr = ["", "", ""];

        // update functionality
        /*  
            call for findOneAndUpdate
                if anything matches then update it
            else 
                save it as a new item
            
        */
        
        const lodashTitle = _.trim(req.body.title);

        const updatedTextArea = req.body.page;
        console.log("textArea " + updatedTextArea);

        Journal.findOneAndRemove({title: lodashTitle}, function(err) {
            if (err) {
                console.log(err); 
            } else {
                console.log("Item deleted successfully");
            } 
        });

        // let foundJournal;
        // Journal.findOne({title: lodashTitle}, (err, foundItem) => {
        //     console.log("Found item with title " + lodashTitle);
        //     console.log(foundItem);
        //     foundJournal = foundItem;
        // });
        // console.log("foundJournal " + foundJournal);

        const journal = new Journal({
            tag: req.body.tagValue,
            title: lodashTitle,
            textArea: req.body.page,
            date: dayTime
        }); 
    
        journal.save();
        
        res.redirect("/");
        
    }
    
    



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



app.get("/demo", function(req, res) {
    res.send("<p> Hello there! ");
});


// =============     route parameter           ==============================================
// Setting route parameter for filter tags
app.get("/:values", function(req, res) {
    console.log(req.params.values);
 
    enteredVal = _.capitalize(req.params.values);

    // filterActive = true;
    let activeTag = enteredVal;

    Journal.find({tag: activeTag}, function(err, journals) {
        if (journals.length === 0) {
            // isFilterEmpty = true;
            res.render('post', {noteBookHTML: journals});
        } else {
            res.render('post', {noteBookHTML: journals});
        }
    });
    // res.redirect("/");
    
});

// Route params for "Read More" button
app.get("/added/:title", function(req, res) {
    
    const titleEntered = _.trim(req.params.title);
    
    console.log("title =>" + req.params.title + ". ");
    console.log("titleEntered =>" + titleEntered + ". ");

    // Find the matched Journal from DB
    Journal.findOne({title: titleEntered}, function(err, journal) {
        console.log(journal);
        // console.log(journal.textArea);
        res.render("added", {journalHTML: journal});
    });

});


// Set up server
app.listen(3000, function() {
    console.log("Server is running on port 3000");
})



/*
    
  

*/


















