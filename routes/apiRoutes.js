// Require data model
var db = require("../models");

// Require Express
const express = require('express');
const unirest = require('unirest');
const axios = require('axios');

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
    
    // ==========================================================================
    //  GET ROUTES
    // ==========================================================================

    /* HOME ROUTE */

    app.get("/", function(req, res) {

      res.render('home');
    });
    
    app.get("/users/new", function(req, res) {
      res.render('new-user');
    });

    app.get("/drug/new", function(req, res) {
      res.render("new-drug");
    });

    app.get("/users", function(req, res) {
      res.render("users");
    });

    
    /* 'DRUG/NEW' PAGE & 'USERS' PAGE:  GET EMAIL FROM USERS TABLE FOR DROPDOWN  */
    app.get("/usersEmail", function(req, res) {
      db.User.findAll({
        // this WORKS!
        attributes : ['email']})
        
        .then( results => {
        var emailArr = [];
        // loop through and get emails for each user
        for (var i = 0; i < results.length; i++) { 
          for (key in results[i].dataValues) {
            // pass to array
           emailArr.push(results[i].dataValues[key]);
          } // end inner for
        } // end outer for

        // send back to calling function order to render email drop down
        res.json(emailArr);

      }); // end promise
    }); // end get users email

   

    // ==========================================================================
    // POST ROUTES
    // ==========================================================================

    /* 'USERS' PAGE: GET SAVED DRUGS FROM DB, TAKES USER EMAIL AS INPUT*/
    
    app.post("/savedDrugs", function(req, res){

      db.Drug.findAll({attributes: ['drugCombo'],where: {UserEmail: req.body.email}})
        .then( results => {
        var drugArr = [];
        for (var i = 0; i < results.length; i++) { 
          for (item in results[i]) {
            if (item === 'dataValues') {
              for(subitem in results[i][item]) {
                if (subitem === 'drugCombo') {
                  drugArr.push(results[i][item][subitem]);
                }
              }
            }
          }
        }// end outer for

        //console.log(drugArr);
        // send saved drugs back to calling function
        res.json(drugArr);

      }); // end promise
    }); // end get saved drugs

    
    /* ADD NEW USER ROUTE */
    // use body-parser via express to access form data
    app.post("/users/new", function(req, res) {
        
        // insert new user into Users table
        db.User.create({email: req.body.userEmail, firstname: req.body.userFirstName, lastname: req.body.userLastName, age: req.body.userAge, sex: req.body.userSex}).then(function(){
          // redirect to next page in the flow
          res.redirect("/drug/new");
        });    
      });

    /* API CALL GET DRUG NAME */
    app.post("/api/getDrug", function(req, res) {
          //console.log(req.body.name);
          // api call to get drug name, pass in req.body object (specifically the value of 'name' key) into API call
           var results1 = '';
           unirest.get("https://iterar-mapi-us.p.rapidapi.com/api/autocomplete?query="+req.body.name).header("X-RapidAPI-Key", "0xAyFD96WlmshBNnpLcUfgSrWzCvp15QZAnjsnwA8grd2AfWRB").end(function (results) {
              //results1 = JSON.stringify(results.body);
              for (var i = 0; i < results.body.suggestions.length; i++) {
                  results1 += results.body.suggestions[i] + ' || '
              }
              // send result back to new drug page
              res.send(results1);
          });
    }); // END GET DRUG NAME

    /* API CALL GET DRUG INTERACTION */
    app.post("/api/interaction", function(req, res) {

      // need to get age and sex from user table
      // This array is initialized as empty but will be filled in with the symptoms that are common to both the user's age and gender
      var mostLikelySymptoms = '';
      var otherPossibleSymptoms = '';
      var symptomResponseArr = [];

      // Initialize Keys
      var age;
      var gender;

      db.User.findAll({
        // find all drugs associated with user
        include: [ db.Drug ],
        // this where points to User
        where: {email:req.body.email},
        
        }).then( results => {

          age = results[0].dataValues.age
          gender =  results[0].dataValues.sex

      });

      // save drug combo to db
      // sequelize does not need to have an explicit join as does SQL.  Tested with invalid email and constraint was enforced.
      var drugCombo = req.body.name1 +'-'+ req.body.name2 +'-'+ req.body.email;
      console.log(drugCombo);
      db.Drug.create({drugname1: req.body.name1, drugname2: req.body.name2, drugCombo, UserEmail:req.body.email});
      // api call to get drug interaction, return data to calling form
      console.log('in api interaction', req.body);
      var queryUrl = "https://www.ehealthme.com/api/v1/drug-interaction/" + req.body.name1 + "/" + req.body.name2 + "/";
      axios.get(queryUrl).then(
        function(response) {
        try {
          // response tested as functional using 'zoloft' and 'acetaminophen'
          // console.log(response);
          // console.log('age is',age)
          // console.log('gender is',gender)

          test = response;
          //console.log('test is', test.data.age_interaction)
          for (var i = 0; i < test.data.age_interaction[age].length; i++) {
              for (var j = 0; j < test.data.gender_interaction[gender].length; j++) {
                  if (test.data.age_interaction[age][i] === test.data.gender_interaction[gender][j]) {
                      mostLikelySymptoms += test.data.age_interaction[age][i] + ' || '
                  }
              }
          }
          //console.log('most likey symptoms', mostLikelySymptoms);
          symptomResponseArr.push(mostLikelySymptoms);
        }
        catch(err) {
          console.log(err);
        }
        }).then(function() {
          try {
            for (var i = 0; i < test.data.age_interaction[age].length; i++) {
                for (var j = 0; j < mostLikelySymptoms.length; j++) {
                    if (test.data.age_interaction[age][i] !== mostLikelySymptoms[j]) {
                        if (!otherPossibleSymptoms.includes(test.data.age_interaction[age][i])) {
                        otherPossibleSymptoms += test.data.age_interaction[age][i] + ' || '
                        }
                    }
                }
            }
            for (var i = 0; i < test.data.gender_interaction[gender].length; i++) {
              for (var j = 0; j < mostLikelySymptoms.length; j++) {
                  if (test.data.gender_interaction[gender][i] !== mostLikelySymptoms[j]) {
                      if (!otherPossibleSymptoms.includes(test.data.gender_interaction[gender][i])) {
                      otherPossibleSymptoms += test.data.gender_interaction[gender][i] + ' || '
                      }
                  }
              }
            }
            //console.log('other possible symptoms', otherPossibleSymptoms);
            symptomResponseArr.push(otherPossibleSymptoms);
            console.log('Array',symptomResponseArr);
            
            // return data to calling function
            res.json(symptomResponseArr);
          }
          catch(err) {
            console.log(err);
          }
        }).catch(function(err){
            console.log('there is an error', err);
            res.send('500 Error');
        });

    }); // END INTERACTION API

  // ==========================================================================
  // TEST ROUTE UNUSED BY APP
  // ==========================================================================
  
    /* TEST ROUTE FOR DRUG SEQUELIZE - APP DOES NOT USE THIS ROUTE */
    app.get("/db/test", function(req, res) { 
        res.send('testing db, see node console!')

        // *** VIA USERS TABLE, FIND ALL DRUGS FOR USER WHERE EMAIL ... **/
        db.User.findAll({
        // find all drugs associated with user
        include: [ db.Drug ],
        // this where points to User
        where: {email: 'solo@falcon.com'},
        
        }).then( results => {

        /* log firstname lastname */
        console.log(results[0].dataValues.age, results[0].dataValues.sex,);

        /* log the first 2 drug combos for solo*/
        // console.log(results[0].dataValues.Drugs[0].dataValues.drugname1, results[0].dataValues.Drugs[0].dataValues.drugname2);
        // console.log(results[0].dataValues.Drugs[1].dataValues.drugname1, results[0].dataValues.Drugs[1].dataValues.drugname2);


        /* log all drug combos for solo */
        var drugArr = [];
        for (var i = 0; i < results.length; i++) { 
          for (var j = 0; j < results[i].dataValues.Drugs.length; j++) {
            for (key in results[i].dataValues.Drugs[j].dataValues) {
              if (key.includes('drugname')){
                  //console.log(results[i].dataValues.Drugs[j].dataValues[key]);
                  // pass to array
                  drugArr.push(results[i].dataValues.Drugs[j].dataValues[key]);
              }   
            }
          }
          //console.log(drugArr);
          //res.send(drugArr)
        }
      });
    }); // END TEST ROUTE FOR DB

    // ==========================================================================
    // 404 ROUTE
    // ==========================================================================
    
    app.get('*', function(req, res) {
      res.render('404');
    });

}; // END MODULE EXPORTS



  

  