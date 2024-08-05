//jshint esversion: 6

//Database
const mongoose = require("mongoose");
const url = ""; //replace with your own
mongoose.connect(url);
const projectSchema = new mongoose.Schema({
    name: String,
    value: Number,
    category: String,
    Date: String,
    periodicity: String 
});
const Project = mongoose.model("Entry", projectSchema);

//Helper functions
const addition = require(__dirname + "\\src\\helper\\Addition.cjs");
const validate = require(__dirname + "\\src\\helper\\Validate.cjs");
const percentage = require(__dirname + "\\src\\helper\\Percentage.cjs");
const period = require(__dirname + "\\src\\helper\\Timeperiod.cjs");

//CRUD
const create = require(__dirname + "\\src\\database\\Create.cjs");
const query = require(__dirname + "\\src\\database\\Read.cjs");
//const remove = require(__dirname + "\\src\\database\\Delete.cjs");
//const update = require(__dirname + "\\src\\database\\Update.cjs");

//general requirements
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
const rp = require('request-promise');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    res.render("index")
});

app.get("/enterData", function(req, res) {
    res.render("enterData")
});

app.get("/displayData", async(req, res) => {
    //retrieve database information
    const databaseEntries = await query.Query(Project);

    //calculate total cost
    const costArray = [];
    for (var i = 0; i<databaseEntries.length; i++) {
        costArray.push(databaseEntries[i].value);
    }
    const total_cost = addition.Addition(costArray);
    
    //render
    res.render("displayData", {total: total_cost, newListItems: databaseEntries})
});

app.post("/", function(req, res) {
    var operation = Number(req.body.boa);

    if (operation == 0) {
        console.log("here");

        //retrieve form information
        const frequency = req.body.frequency;
        const amount = Number(req.body.amount);
        const name = req.body.name;
        const category = req.body.category;

        console.log(name);
        console.log(amount);

        //check if everything is entered properly
        if(amount == null) {
            res.redirect("http://localhost:3000/enterData");
        }
        else if (name == null) {
            res.redirect("http://localhost:3000/enterData");
        }
        else {
            //use frequency to determine how often it recurs
            //var nextCharge = period.Period(frequency);
            var nextCharge = "soon";

            //create a new database entry
            create.Create(Project, name, amount, category, frequency);

            res.redirect("http://localhost:3000/displayData");
        }
    }
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server listening on port 3000");
});