var express = require('express')
  , app = express() // Web framework to handle routing requests
  , cons = require('consolidate') // Templating library adapter for Express
  , MongoClient = require('mongodb').MongoClient // Driver for connecting to MongoDB
  , routes = require('./routes'); // Routes for our application
  var bodyParser = require('body-parser');
  var multer = require('multer'); 

var  os = require('os');


console.log('OS arch:' + JSON.stringify(os.arch()));
console.log('process.platform :' + JSON.stringify(process.platform));


MongoClient.connect('mongodb://localhost:27017/AGLC', function(err, db) {
    "use strict";
    if(err) throw err;

  app.engine('html', cons.swig);
  app.set('view engine', 'html');
  app.set('views', __dirname + "/views");
  app.use('/', express.static(__dirname + '/'));
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(multer()); // for parsing multipart/form-data
  // Express middleware to populate 'req.cookies' so we can access cookies
  app.use(express.cookieParser());


// display the main screen with the links to choices of action.	
  app.get('/', function(req, res){
 res.render('main_template', { 'name' : 'Library Main'});
});


    // Define Application routes ---------------------

    routes(app, db);


   // End Application routes ---------------------

    //Error when page not found
   app.get('*', function (req, res) {
   res.send('Page not found', 404);
   });

 app.listen(8181);

 console.log("Express server started on port 8181");
});
