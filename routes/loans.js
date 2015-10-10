/* The LoansDAO must be constructed with a connected database object */
function LoansDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
       console.log('Entered LoansDAO constructor...');
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
  function shortDate(d){
   return (d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear());
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
    this.insertEntry = function (type, loan, callback) {
        "use strict";
        console.log("inserting loan entry for: " + type );
        var dt = new Date();
        if(type === 'checkout'){
          loan.CoDate = dt;
          loan.DueDate = getDueDate(dt);
          loan.CiDate = null;
        } else if (type === 'checkin'){
          loan.CiDate=dt;
        }
 
        // now insert/update the loan
          loans.insert(loan, function(err, wr){
            if(err) throw err;
            console.log('WriteConcern: ' + JSON.stringify(wr));
            callback(err,loan );
          });
    }
 this.updateEntry= function(type, q, callback){
    console.log('Entered loans.updateEntry with query: ' + JSON.stringify(q) + ' for type: ' + JSON.stringify(type));
    loans.update(q, {$currentDate: {CiDate: true }}, function(err, updated){
    callback(err, updated);
    });
 }   
    function getDueDate(d){
    var twoWeeksMs = 2*7*24*60*60*1000;
    return new Date(d.getTime()+twoWeeksMs); 
    }
    
console.log('Finished LoansDAO constructor.');
}
module.exports.LoansDAO = LoansDAO;
