var BooksDAO = require('./books.js')
var MongoClient= require('mongodb').MongoClient;

  MongoClient.connect('mongodb://localhost:27017/AGLC', function(err, db) {
    "use strict";
  if(err) throw err;
//  console.log('have connection to mongo db: ' + JSON.stringify( db));
  var allBooks;
  var selected = 5;
  var bk;
  var books = db.collection('resources');
  var map=[];
  books.find({}, {_id:0}, function(err, items, callback){
    if(err) { throw err; }
    items.toArray(function(err, allBooks){
      if(err) throw err;
      for(var i=0; i< allBooks.length; i++){
       bk = allBooks[i];
       if(bk !=null) map[bk.ID]= bk;
    } 
    console.log('Count: ' + allBooks.length);
    console.log('ID: 100 is: '+ JSON.stringify(map[100]))
    console.log('Title for ID: 100 is: '+ JSON.stringify(map[100].Title))
   });
});
});

/*-----
  var aglc = new BooksDAO(db)
  var books = aglc.collection('resources');
  var allBooks=  books.getBooks();
  console.log(allBooks[selected]);
--------*/
