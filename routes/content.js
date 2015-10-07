/*----------- File: routes/content.js---------------*/
 var ObjectID = require('mongodb').ObjectID,
     Binary = require('mongodb').Binary

 var LoansDAO =   require('./loans').LoansDAO
 ,   PatronsDAO = require('./patrons').PatronsDAO
 ,   BooksDAO =   require('./books').BooksDAO
 ,   sanitize = require('validator').sanitize // Helper to sanitize form input;

/* ---------------The ContentHandler must be constructed with a connected db -------- */
     var allBooks, allPatrons, allLoans;
     var loans, patrons, books;
     var booklist = '<option val=-999 >Large List. You must enter at least 3 consecutive chars at left.</option>'

function ContentHandler (db, url) {
    "use strict";
     console.log('Entered contentHandler with db and url: ' + url +'.')
      // instantiate the DAOs
     loans = new LoansDAO(db);
     patrons = new PatronsDAO(db);
     books = new BooksDAO(db);

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
            bf: '',
            users: allPatrons,
            books: booklist,
            server: '' + url,
            cnt: 0
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
 this.displayReports = function(req, res, next) {
        "use strict";
            return res.render('viewreports_template', {
            name : 'Reports',
            reportx: 'Initially empty but will contain information about the selected report.'
            });
 }

 this.displayReportx = function(req, res, next) {
        "use strict";
         var rpt = req.body.reporttype;
           console.log('Entered displayReportx with report type: '+ rpt )
            return res.render('viewreports_template', {
            name : rpt,
            reportx: 'This will be the result of a fetch from the mongoDB.'
            });
 }
 
 this.displayFiltered = function(req, res, next) {
        "use strict";
            var fb = req.body.filter_books;
            console.log('Entered content.displayFiltered with fb: ' + fb );
            if(fb && fb.length) {
             console.log('filtering books...')
             books.filterBooks( fb, function(err, count, bookList){ 
               console.log('retrieved books: ' +  count)
               res.render('loans_template', {
               name : 'Book Loans',
               bf: fb,
               users: allPatrons,
               books: bookList,
               server: '' + url,
               cnt: count
           });  //render call
          });  //DAO call
         } //if
  } //function

  this.handleBookCheckout = function(req, res, next) {
        "use strict";
            var poid = ObjectID.createFromHexString(req.body.patron.toString());
            var boid = ObjectID.createFromHexString(req.body.book.toString());
            console.log('Entered content.handleBookCheckout for patronId: ' + poid + ' bookid: ' + boid);
            createLoan(res, poid, boid );
  } //function

  function createLoan(res, patronid, bookid){
     console.log('Entered function createLoan in content.handleCheckout');
     var theBook;
     var thePatron;
     books.getById(bookid, function(err, book){
       if(err) throw err;
       theBook = book;
       patrons.getById(patronid, function( err, patron){
        if(err) throw err;
        thePatron = patron; 
        var theLoan= {bookId: bookid, patronId: patronid, Title: theBook.Title, Contact: thePatron.lastName + ', '+ thePatron.firstName };
        console.log('loan: ' + JSON.stringify(theLoan));
        loans.insertEntry('checkout', theLoan, function(err, saved){
         if(err) throw err;
          console.log('content.handleBookCheckout saved: ' + JSON.stringify(saved));
          res.render('loans_template', 
            {
             name : 'Checkout of: '+ theLoan.Title + ' to: ' + theLoan.Contact,
             bf: '',
             users: allPatrons,
             books: booklist,
             server: '' + url,
             cnt: 0
            });
                   });
     });
  });
 }

console.log('Finished contentHandler.')
}   //ContentHandler.

module.exports = ContentHandler;
