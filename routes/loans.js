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
    var openloans = { "CiDate" : { "$eq" : null } };
  //functions
    this.getCount = function(callback){
    console.log('entered loans.getCount');
    var count= loans.count(openloans);
    callback(count);
} //function
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
   } //function
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
  } //function
    this.getMissingBooks = function( callback) {
        "use strict";
           console.log('entered loans.getMissingBooks'); 
         var today = new Date();
           callback(null, 'Query not Yet Implemented for getMissingOrLostBooks.' );
  } //function
    this.getNewBooks = function( callback) {
        "use strict";
           console.log('entered loans.getNewBooks'); 
         var today = new Date(); 
           callback(null, 'Query Not Yet Implemented for getNewBooks.' );
  } //function
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
}//function
 this.updateEntry= function(type, q, callback){
    console.log('Entered loans.updateEntry with query: ' + JSON.stringify(q) + ' for type: ' + JSON.stringify(type));
    loans.update(q, {$currentDate: {CiDate: true }}, function(err, updated){
    callback(err, updated);
    });
}//function
this.getOpenLoans=function(callback1){
//    console.log('Entered loans.getOpenLoans with query: ' + JSON.stringify(openloans));
    loans.find(openloans).toArray(function(err, ary){
       if(err)throw err;      
       makeOptions(ary, function(count, html){
         callback1(count, html);
    });
   });
}  //function
this.filterByPerson=function(pf, callback){
  loans.find({  "CiDate" : { "$eq" : null } , Contact: { $regex: '(?i)' + pf }}).toArray( function(err, items){
   if(err) throw err;
 makeOptions(items, function(count, html){
         callback( count, html);
   });
 });
}//function
var getDueDate = function(d){
    var twoWeeksMs = 2*7*24*60*60*1000;
    return new Date(d.getTime()+twoWeeksMs); 
}//function
var makeOptions = function(openloans, callback2){
 var html='';
 var count=0;
 var pre = '<option value="';
 var mid =  '">' ;
 var end = '</option>';
 var loan;
 for(var i=0; i< openloans.length; i++){
   loan = openloans[i];
   html += pre + loan._id + '_' + loan.bookId + mid + loan.Title + '_' + loan.Contact + end;
   count++;
//   console.log('in loan loop, '+ count + '. html: ' + html);
}//for loop
 console.log('loans: ' + count + ' html: ' + html);
 callback2(count, html);
}//function
 var shortDate = function(d){
   return (d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear());
  } //function     
console.log('Finished LoansDAO constructor.');
} //constructor
module.exports.LoansDAO = LoansDAO;
