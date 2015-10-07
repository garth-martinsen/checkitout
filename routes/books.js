/* --------------------
resource record: "ID" : 36, "Title" : "The Three Little Pigs-Los Tres Cerditos", "Language" : "Bilingual", "Status" : "Available" 
-------------------- */ 
var ObjectId = require('mongodb').ObjectID;

/* The BooksDAO must be constructed with a connected database object */
function BooksDAO(db) {
    "use strict";
       console.log('Entered BooksDAO constructor...');

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof BooksDAO)) {
        console.log('Warning: BooksDAO constructor called without "new" operator');
        return new BooksDAO(db);
        }

    var books = db.collection('resources');

    this.getCount = function(callback){
        "use strict";
      var num = books.count();
      console.log('Count: ' + num );
      callback(null, num) ;
}

   this.getById = function(id, callback){
        "use strict";
      console.log('Entered function books.getById: ' + id.toHexString() );
      var q = {'_id' : ObjectId(id.toHexString())};
      var theBook;     
      books.find(q).toArray(function(err, libros){
      theBook = libros[0];
      console.log('Book found: ' + JSON.stringify(theBook));
      callback(null, theBook) ;
     });
   }

    this.getBooks = function( callback) {
        "use strict";
           console.log('entered books.getBooks');
        books.find().sort({'Title': 1}).toArray(function(err, items) {
            if (err) return callback(err, null);
            console.log("Found " + items.length + " books");
            var html='';
            var bk;
            for(var i=0; i<items.length; i++){
             bk = items[i]; 
            html += makeOption(bk._id, bk.Title + ':' + bk.Language );
         }

           callback(null, html);
 });
 }
 
    this.filterBooks = function( word,  callback) {
        "use strict";
           console.log('entered books.filterBooks with word: '+ word);
           books.find({ Title: { $regex: '(?i)' + word }}).sort({'Title' : 1}).toArray(function(err, items) {
            if (err) return callback(err, null);
            console.log("Found " + items.length + " books");
            var html='';
            var bk;
            for(var i=0; i<items.length; i++){
             bk = items[i]; 
            html += makeOption(bk._id.toString(), bk.Title + ':' + bk.Language );
    //            console.log('list: ' + html)
         }
           callback(null, items.length, html);
   });
 }
       console.log('Finished BooksDAO constructor...');

} //BooksDAO constructor
   
function makeOption(val, display){
  return  '<option value="'+ val + '">' + display +'</option>'
}

module.exports.BooksDAO = BooksDAO;
