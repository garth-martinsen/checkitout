/* --------------------
     var books = require('books')
     var contacts = require('contacts')
-------------------- */ 

/* The LoansDAO must be constructed with a connected database object */
function LoansDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
       console.log('Entered LoansDAO constructor...');
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof LoansDAO)) {
        console.log('Warning: LoansDAO constructor called without "new" operator');
        return new LoansDAO(db);
        }

    var loans = db.collection('loans');

    this.getCount = function(callback){
    var num = loans.count();
    console.log('Count: ' + num );
    callback(null, num) ;
}


    this.getLoans = function( callback) {
        "use strict";
           console.log('entered loans.getLoans');
        loans.find({},{_id:0}).sort('CoDate', -1).toArray(function(err, items) {
            if (err) return callback(err, null);
            console.log("Found " + items.length + " loans");
           var text='';
           for( var i=0; i< items.length; i++){
            text += 'CO: ' + shortDate(items[i].CoDate) + ' Due: ' + shortDate(items[i].DueDate) + ' By: ' + items[i].Contact + ' Book: ' + items[i].Title ; 
            }
           callback(null, text );

});
}
 
    this.getBooksDue = function( callback) {
        "use strict";
           console.log('entered loans.getBooksDue');
         var today = new Date();
                
        loans.find({ DueDate : {$lt : today }},{_id:0}).sort('CoDate', -1).toArray(function(err, items) {
            if (err) return callback(err, null);
            console.log("Found " + items.length + " loans");
           var text='';
           for( var i=0; i< items.length; i++){
            text += 'CO: ' + shortDate(items[i].CoDate) + ' Due: ' + shortDate(items[i].DueDate) + ' By: ' + items[i].Contact + ' Book: ' + items[i].Title ; 
            }
           callback(null, text );

});
}


    this.getOverdues = function( callback) {
        "use strict";
           console.log('entered loans.getOverdues');
         var today = new Date();
                
        loans.find({ DueDate : {$lt : today }},{_id:0}).sort('CoDate', -1).toArray(function(err, items) {
            if (err) return callback(err, null);
            console.log("Found " + items.length + " loans");
           var text='';
           for( var i=0; i< items.length; i++){
            text += 'CO: ' + shortDate(items[i].CoDate) + ' Due: ' + shortDate(items[i].DueDate) + ' By: ' + items[i].Contact + ' Book: ' + items[i].Title ; 
            }
           callback(null, text );
});
}

    this.getMissingBooks = function( callback) {
        "use strict";
           console.log('entered loans.getMissingBooks'); 
         var today = new Date();
    
           callback(null, 'Query not Yet Implemented for getMissingOrLostBooks.' );
}

    this.getNewBooks = function( callback) {
        "use strict";
           console.log('entered loans.getNewBooks'); 
         var today = new Date();
   
           callback(null, 'Query Not Yet Implemented for getNewBooks.' );
}



function shortDate(d){
return (d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear());
}   



/*
  loans.getLoans(function (err, result){
   loans.getOverdues(function (err, result){
   loans.getBooksDue(function (err, result){
   loans.getMissingOrLostBooks(function (err, result){
   loans.getNewBooks(function (err, result)
*/

/*  ----------------------------------------
    this.insertEntry = function (title, patron, callback) {
        "use strict";
        console.log("inserting loan entry" + title + patron);
       
        var dt = new Date();
        // Build a new loan
        var loan = {"title": title,
                "contact": patron,
                "CoDate": dt,
                "DueDate" : getDueDate(dt)),
                 "CiDate" :    }

        // now insert the loan
          loans.insert(loan, function(err, wr){
            if(err) throw err;
            callback(err, permalink);
            console.log('WriteConcern: ' + JSON.stringify(wr));
          });
    }
   
    function getDueDate(d){
    var twoWeeksMs = 2*7*24*60*60*1000;
    return new Date(d.getTime()+twoWeeksMs); 

    }
 -------------------------------------- */
}
module.exports.LoansDAO = LoansDAO;
