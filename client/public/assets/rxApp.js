
$(document).ready(function() {

    // We may not need these event bubblers but here they are and they work
    // event bubbling: listening on parent 
    $('#userAge').on('click', (event) => { 
        event.preventDefault();
        var userAge1 = $( "#userAge" ).val();
        console.log(userAge1);
        }); 

    // event bubbling: listening on parent 
    $('#userSex').on('click', (event) => { 
        event.preventDefault();
        var userSex1 = $( "#userSex" ).val();
        console.log(userSex1);
        }); 


    /* ==========================================================================
       Email Search - New Users Page
       ========================================================================== */
    
    // call to squelize for user emails
    $('#dropdownNDFindYouButton').on('click', (event) => {
        console.log('clicked');
        event.preventDefault();
        $("#emailReturn").empty();
        // get emails from sequelize within users route
        $.get("/usersEmail", function(data) {
            if (data) {
                // send data back to page
                $.each(data, function(index, value) {
                    console.log('value is', value)
                    // populate the select dropdown
                    var optionItemEmail = $('<option>');
                    optionItemEmail.text(value);
                    $("#emailReturn").append(optionItemEmail);
                });
            }
        });
    });

    /* ==========================================================================
       Get Drug Combos and Interaction Search - Returning Users Page
       ========================================================================== */
    
    // click even to get emails
    $('#dropdownEXUFindYouButton').on('click', (event) => {
        console.log('clicked');
        event.preventDefault();
        // ensure the medications dropdown is emptied of prior searches so they do not append
        $("#emailReturn").empty();
        $("#comboReturn").empty();

        // the drugs retrieved need to be based on the user's email selected.
        $.get("/usersEmail", function(data) {
            if (data) {
                // send data back to page
                $.each(data, function(index, value) {
                    console.log('value is', value)
                    // populate the select dropdown
                    var optionItemEmail = $('<option>');
                    optionItemEmail.text(value);
                    $("#emailReturn").append(optionItemEmail);
                });
            }
        });
    }); // dropdownEXUFindYouButton

    // click event to get drug combos
     $('#emailReturn').on('click', (event) => {
         console.log('clicked');
         $("#comboReturn").empty();
         event.preventDefault();
        // ensure the medications dropdown is emptied of prior searches so they do not append;

        // get email value
        var userEmailObject = {email: $('#emailReturn').val().trim()};
        console.log('user selected is',userEmailObject)

        // the drugs retrieved need to be based on the user's email selected.
        $.post("/savedDrugs", userEmailObject)
            .then(function(data) {
            if (data) {
                // send data back to page
                $.each(data, function(index, value) {
                    console.log('value is', value)
                    // populate the select dropdown
                    // combos are based on drug table records drugname1 + drugname2. 
                    // since combo is primary key, need to get rid of email portion of combo
                    var drugComboArr = value.split('-');
                    var optionItemCombo = $('<option>');
                    var drugNamesOnly = drugComboArr[0]+'-'+drugComboArr[1];
                    optionItemCombo.text(drugNamesOnly);
                    $("#comboReturn").append(optionItemCombo);   
                });
            }
        });
    });

    // click event to get saved searches from returning users page via drug interactions API search
    $('#EXUSearchSubmit').on('click', (event) => {
        console.log('clicked submit');
        event.preventDefault()
        var combo = $("#comboReturn").val().trim();
        var comboArr = combo.split('-');
        // remove any drug name values from page on search submit
        $("#drugInteractionsReturn").empty();
        // create object so api can recieve req.body, object will also be used to insert into drugs db
        var drugInterActions = {
                 // create drug interaction search object
                 name1: comboArr[0],
                 name2: comboArr[1],
                 email: $('#emailReturn').val().trim()
        };
        
        // call getInteractons passing the drugInteractions Object
        getInteraction(drugInterActions);
    });
    
    

    /* ==========================================================================
       Drug Name Search - New Drug Page
       ========================================================================== */
    
    // call to drug search API for drug names
    $('#drugSearchBtn').on('click', (event) => {
        event.preventDefault();

        // remove any prior drug interaction searches
        $("#drugInteractionsReturn").empty();

        // create object so api can recieve req.body
        var drugName = {name: $('#drugSearch').val().trim()};

        // send object to api.  POST requires promise
        $.post("/api/getDrug", drugName)
            // recieve data back to page
             .then(function(data) {
                if (data) {
                    // construct drug list paragraph and append to page
                    var drugs = $('<p>');
                    drugs.text(data);
                    $("#drugReturnList").append(drugs);
                }
            });
    });


    /* ==========================================================================
       Drug Interaction Search - New Drug Page
       ========================================================================== */
    
    // drug interactions API search
    $('#newDrugComboSubmit').on('click', (event) => {
        event.preventDefault()
        // remove any drug name values from page on search submit
        $("#drugReturnList").empty();
        // empty any prior search results
        $("#drugInteractionsReturn").empty();
        // create object so api can recieve req.body, object will also be used to insert into drugs db
        var drugInterActions = {
                name1: $('#drug1').val().trim(),
                name2: $('#drug2').val().trim(),
                email: $('#emailReturn').val().trim()
            };

        // call getInteractons passing the drugInteractions Object
        getInteraction(drugInterActions);

    });


    /* ==========================================================================
       Get Drug Interaction - New Drug Page and Returning Users Page
       ========================================================================== */
    
    function getInteraction(drugInterActions) {
    $.post("/api/interaction", drugInterActions)
            // recieve data back to page
            .then(function(data) {
                // if we get the api' error page or a blank object (zoloft/lipitor)
                if(data === '500 Error' || data === '') {
                    // if empty response from API due to no interaction data
                    var header1 = $('<p>');
                    var header2 = $('<p>');
                    header1.text('** THERE IS NO INTERACTION DATA FOR THAT DRUG COMBINATION.**')
                    header2.text('** PLEASE CONSULT YOUR PHYSICIAN BEFORE TAKING.**')
                    $("#drugInteractionsReturn").append(header1);
                    $("#drugInteractionsReturn").append(header2);

                
                } else {
                    // add interaction data to page
                    var header = $('<p>');
                    var interactions = $('<p>');
                    header.text('MOST LIKELY INTERACTIONS FOR YOUR AGE:')
                    interactions.text(data[0]);
                    $("#drugInteractionsReturn").append(header);
                    $("#drugInteractionsReturn").append(interactions);
                
                    var header = $('<p>');
                    var interactions = $('<p>');
                    header.text('ALL POSSIBLE INTERACTIONS FOR YOUR AGE:')
                    interactions.text(data[1]);
                    $("#drugInteractionsReturn").append(header);
                    $("#drugInteractionsReturn").append(interactions);
                }
            });
    } // end function


});  // end Document Ready

