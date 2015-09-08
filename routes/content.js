<!------ File: routes/content.js--------------->

 var LoansDAO = require('./loans').LoansDAO
 var sanitize = require('validator').sanitize; // Helper to sanitize form input;
var url = require('url');
var qs = require('queryString');
var http = require('http');

/* ---------------The ContentHandler must be constructed with a connected db -------- */

function ContentHandler (db) {
    "use strict";

 var loans = new LoansDAO(db);


    this.displayMainPage = function(req, res, next) {
        "use strict";
            return res.render('main_template', {
            name : 'Library Main'
            });
        }

   this.displayReportxForm = function(req, res, next){
        "use strict";
            var rpt = req.body.reporttype;
            console.log('ReportType: ' + rpt );
            if (typeof rpt !== 'undefined') {
              // rpt is defined so do redirect
              console.log('rewrite url to: http://localhost:8181/reportx/' + rpt);
              http.get({ host: "localhost", port: 8181, path: "/reportx/" + rpt }, function (resp) { 
             return res.render( 'reportx_template',{
                  name: rpt,
                  reportx: resp 
                });
             });
            } else {
            console.log('View Reports displayed.');
            return res.render('reportx_template', {
            name : 'View Reports',
            reportx: 'This is the initial entry'
            });
   } 
}

   this.displayBookLoan = function(req, res, next){
        "use strict";

            return res.render('loans_template', {
                name: 'Book Loans',
            }); 

    }

   this.displayNewBookForm = function(req, res, next){
        "use strict";
            return res.render('newbook_template', {
            name : 'Manage Books'
            });
    console.log('NewBookForm displayed.');
   } 

   this.displayNewPatronForm = function(req, res, next){
        "use strict";
            return res.render('newpatron_template', {
            name : 'Manage Patrons'
            });
    console.log('NewPatronForm displayed.');
   } 


/* --------gets using routes----------*/

   this.displayLoans = function(req, res ){
   "use strict";
   console.log('displayLoans function called.' );
   console.log('Request.method: ' + req.method);
   loans.getLoans(function (err, result){
      if(err) throw err;

   return res.render('reportx_template', 
                   {
                    name: 'Book Loans',
                    reportx: result 
                   }
                 );
});
}
 
  this.displayOverdueBooks = function(req, res){
   "use strict";
   console.log('handleOverdueBooks function called.' );
   console.log('Request.method: ' + req.method);
   loans.getOverdues(function (err, result){
   return res.render('reportx_template', 
                   {
                    name: 'Overdue Books',
                    reportx: result 
                   }
                 );
   }); 

}
  this.displayBooksDue = function(req, res){
   "use strict";
   console.log('displayBooksDue function called.' );
   console.log('Request.method: ' + req.method);
   loans.getBooksDue(function (err, result){
   return res.render('reportx_template', 
                   {
                    name: 'Due Books',
                    reportx: result 
                   }
                 );
   }); 

}


  this.displayMissingBooks = function(req, res){
   "use strict";
   console.log('displayMissingBooks function called.' );
   console.log('Request.method: ' + req.method);
   loans.getMissingBooks(function (err, result){
   return res.render('reportx_template', 
                   {
                    name: 'Missing Books',
                    reportx: result 
                   }
                 );
   }); 

}

  this.displayNewBooks = function(req, res){
   "use strict";
   console.log('displayNewBooks  function called.' );
   console.log('Request.method: ' + req.method);
   loans.getNewBooks(function (err, result){
   return res.render('reportx_template', 
                   {
                    name: 'New Books',
                    reportx: result 
                   }
                 );
   }); 

}

/* -------------- content helper private methods.------

function getBooks(books){
   books.getBooks(10, function(err, resources) {
            "use strict";

            if (err) return next(err);
  return createOptions(resources);
 });
}

function getPersons(patrons){
        patrons.getPatrons(10, function(err, persons) {
            "use strict";

            if (err) return next(err);
  return createOptions(persons);
 });
}

function createOptions(cursor){
   var html ='';
    cursor.each(function(err, doc){
          if(doc != null){
            html += '<option value=\"' + doc._id + '\">' + doc.lastName + ', ' + doc.firstName + '</option>'
           }
        else {
            return html;
             }
    });
}
---------------------------------- */

}   //ContentHandler.
module.exports = ContentHandler;
