/*----------- File: routes/content.js---------------*/

 var LoansDAO =   require('./loans').LoansDAO
 ,   PatronsDAO = require('./patrons').PatronsDAO
 ,   BooksDAO =   require('./books').BooksDAO
 ,   sanitize = require('validator').sanitize // Helper to sanitize form input;
 ,   url = require('url')
 ,   http = require('http');

/* ---------------The ContentHandler must be constructed with a connected db -------- */
var allBooks, allPatrons, allLoans;
function ContentHandler (db, url) {
    "use strict";
     console.log('Entered contentHandler with db and url: ' + url +'.')
      var loans = new LoansDAO(db);
      var patrons = new PatronsDAO(db);
      var books = new BooksDAO(db);

      books.getBooks(function(err, libros){ allBooks = libros });
      patrons.getPatrons(function(err, users){ allPatrons = users} );
      loans.getLoans(function(err, lns){ allLoans= lns});

 this.displayMainPage = function(req, res, next) {
        "use strict";
           console.log('Entered displayMainPage with req: '+ json(req) + ' and res: ' + json(res))
            return res.render('main_template', {
            name : 'Library Main'
            });
 }
 this.displayBookLoans = function(req, res, next) {
        "use strict";
           console.log('Entered content.displayBookLoans')
            res.render('loans_template', {
            name : 'Book Loans',
            users: allPatrons,
            books: allBooks,
            server: '' + url
           })
 }
 this.displayNewBook = function(req, res, next) {
        "use strict";
           console.log('Entered displayNewBook with req: '+ req + ' and res: ' + res)
            return res.render('managebooks_template', {
            name : 'Manage Books'
            });
 }
 this.displayNewPatron = function(req, res, next) {
        "use strict";
           console.log('Entered displayNewPatron with req: '+ req + ' and res: ' + res)
            return res.render('managepatrons_template', {
            name : 'Manage Patrons'
            });
 }

 this.displayReportx = function(req, res, next) {
        "use strict";
           console.log('Entered displayReportx with req: '+ req + ' and res: ' + res)
            return res.render('viewreports_template', {
            name : 'Reports',
            reportx: 'Initially empty but will contain information about the selected report.'
            });
 }

 this.displayReport = function(req, res, next) {
        "use strict";
           var rpt = req.body.reporttype;
           console.log('Entered displayReport with report type: '+ rpt )
            return res.render('viewreports_template', {
            name : rpt,
            reportx: 'This will be the result of a fetch from the mongoDB.'
            });
 }
console.log('Finished contentHandler.')
}   //ContentHandler.

module.exports = ContentHandler;
