/* --------------------
contact record:  "firstName" : "Pablo", "lastName" : "Dominguez", "ID" : 16, "ranch" : "Quebracho"
-------------------- */ 

/* The PatronsDAO must be constructed with a connected database object */
function PatronsDAO(db) {
    "use strict";
       console.log('Entered PatronsDAO constructor...');

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof PatronsDAO)) {
        console.log('Warning: LoansDAO constructor called without "new" operator');
        return new PatronsDAO(db);
        }

    var patrons = db.collection('contacts');
//-----------------------------------------------------------

    this.getCount = function(callback){
      var num = patrons.count();
      console.log('Count: ' + num );
      callback(null, num) ;
}

    this.getPatrons = function( callback) {
        "use strict";
           console.log('entered patrons.getPatrons');
        patrons.find({},{_id:0}).sort('CoDate', -1).toArray(function(err, items) {
            if (err) return callback(err, null);
            console.log("Found " + items.length + " patrons.");
            var html='';
            var pat;
            for(var i=0; i<items.length; i++){
             pat = items[i];
            html += makeOption(pat.ID, pat.lastName + ',' + pat.firstName);
         }
           callback(null, html );
       });
 }
 
       console.log('Finished PatronsDAO constructor...');

} //PatronsDAO constructor

  
function makeOption(val, display){
  return  '<option value="'+ val + '">' + display +'</option>'
}

module.exports.PatronsDAO = PatronsDAO;
