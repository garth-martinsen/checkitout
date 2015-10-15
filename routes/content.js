/*----------- File: routes/content.js---------------*/
 var ObjectId = require('mongodb').ObjectID;

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
     loans = new LoansDAO(db);
     patrons = new PatronsDAO(db);
     books = new BooksDAO(db);

      books.getBooks(function(err, libros){ allBooks = libros });
      patrons.getPatrons(function(err, users){ allPatrons = users} );
      loans.getCount(function(err, cnt){allLoans =cnt});
//functions
 this.displayMainPage = function(req, res, next) {
        "use strict";
           console.log('Entered displayMainPage with req: '+ json(req) + ' and res: ' + json(res))
            return res.render('main_template', {
            name : 'Library Main'
            });
 } //function
 this.displayBookLoans = function(req, res, next) {
        "use strict";
           console.log('Entered content.displayBookLoans')
            res.render('loans_template', {
            name : 'Book Loans',
            bf: '',
            users: allPatrons,
            books: booklist,
            server: '' + url,
            cnt:0
           })
 }//function
 this.displayNewBook = function(req, res, next) {
        "use strict";
           console.log('Entered displayNewBook with req: '+ req + ' and res: ' + res)
            return res.render('managebooks_template', {
            name : 'Manage Books'
            });
 }//function
 this.displayNewPatron = function(req, res, next) {
        "use strict";
           console.log('Entered displayNewPatron with req: '+ req + ' and res: ' + res)
            return res.render('managepatrons_template', {
            name : 'Manage Patrons'
            });
 }//function
 this.displayReports = function(req, res, next) {
        "use strict";
            return res.render('viewreports_template', {
            name : 'Reports',
            reportx: 'Initially empty but will contain information about the selected report.'
            });
 }//function
 this.displayReportx = function(req, res, next) {
        "use strict";
         var rpt = req.body.reporttype;
           console.log('Entered displayReportx with report type: '+ rpt )
            return res.render('viewreports_template', {
            name : rpt,
            reportx: 'This will be the result of a fetch from the mongoDB.'
            });
 }//function
 this.displayFilteredBooks = function(req, res, next) {
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
 }//function
  this.handleBookCheckout = function(req, res, next) {
        "use strict";
            var poid = ObjectId(req.body.patron.toString());
            var boid = ObjectId(req.body.book.toString());
            console.log('Entered content.handleBookCheckout for patronId: ' + poid + ' bookid: ' + boid);
            createLoan(res, poid, boid );
  } //function
  this.displayCheckins = function(req, res, next){
      "use strict";
      console.log('Entered content.displayCheckins');
      loans.getOpenLoans(function( count, html){ 
         console.log('content.displayCheckin open loans: ' + count);
         res.render(
          'checkin_template', 
          { 
            name: 'Check in Books',
            pf:'',
            loans: html,
            cnt:count
          }
        );
    });
 }//function
 this.displayFilteredPatrons = function(req, res, next){
   var pf = req.body.filter_persons;
   console.log('Entered content.displayFilteredPatrons by: '+ pf);
   loans.filterByPerson(pf, function(count, html){
    res.render(
      'checkin_template', 
      {
        name:'Check in Books',
        pf: pf,
        loans: html,
        cnt: count
      }
    ); //render
}); //filterByPerson
}//function 
this.handleBookCheckin = function(req, res, next) {
        "use strict";
    var loan = req.body.loan;
    console.log('Entered content.handleBookCheckin with loanid: ' + loan );

    var idAry = loan.split('_');
    var loanid = ObjectId(idAry[0]);
    var bookid= ObjectId(idAry[1]);
    var lnquery=  { "_id" : loanid };
    var bkquery=  { "_id" : bookid };

//    console.log('Entered content.handleBookCheckin for patronId: ' + poid + ' bookid: ' + boid);
    loans.updateEntry('checkin', lnquery, function(err, updated){
      console.log('Updated loans: ' + updated);
      books.updateStatus(bkquery,'Available', function(err, updated){
              console.log('Book marked Available: ' + updated);
         loans.getOpenLoans(function( count, html){
         console.log('content.handleBookCheckin open loans: ' + count);
         res.render('checkin_template', 
              { 
               name: 'Checkin complete.',
           pf:'',
           loans: html,
           cnt:count
          }
        ); //render template
     });
    }); //update book
  }); //update loan       
 }//function

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
         var bkquery=  { "_id" : bookid };
         books.updateStatus(bkquery,'Checkedout', function(err, updated){
           console.log('Book marked Checkedout: ' + updated);
         });
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
