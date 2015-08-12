var express = require('express'), 
app = express(),
cons = require('consolidate');

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + "/views");
app.get('/', function(req, res){
 res.render('PersonList', { 'name' : 'Book Loans'});
});

app.get('*', function (req, res) {
   res.send('Page not founc', 404);
});
app.listen(8181);
console.log("Express server started on port 8181");
