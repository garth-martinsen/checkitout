var app = require('express')()
  , MongoClient = require('mongodb')// MongoClient // Driver for connecting to MongoDB
  , routes = require('./routes') // Routes for our application
  , bodyParser = require('body-parser')
  , compression = require('compression')
  , cookieSession = require('cookie-session')
  , os = require('os');

  console.log()
  console.log('*************************************************')
  console.log('OS arch:' + JSON.stringify(os.arch()));
  console.log('process.platform :' + JSON.stringify(process.platform));
  console.log('*************************************************')
  console.log()

  app.use(compression())               // gzip/deflate outgoing responses 
  app.use(cookieSession({  keys: ['secret1', 'secret2'] }))            // store session state in browser cookie 
  app.use(bodyParser.urlencoded({ extended: true }));    // parse urlencoded request bodies into req.body 
  app.set('view engine', 'ejs');
  app.set('js', __dirname + '/js'); 
  MongoClient.connect('mongodb://localhost:27017/AGLC', function(err, db) {
    "use strict";
  if(err) throw err;

  // display the main screen with the links to choices of action.	
   app.get('/', function(req, res){
     res.render('main_template', { 'name' : 'Library Main'});
   });


   // Define Application routes ---------------------
   routes(app, db);

   //Error when page not found
   app.use(function onerror( err, req, res, next) {
    res.status('404').send({Error: err})
   });
});
 var listener = app.listen(8181, function(){
    app.url= 'http://localhost' + ':' +  listener.address().port ;
    console.log('Listening at:' + app.url);
});
