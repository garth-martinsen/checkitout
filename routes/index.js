// SessionHandler = require('./session');
 var ContentHandler = require('./content');
 var ErrorHandler = require('./error').errorHandler;
 var loans = require('./loans');


exports = function(app, db) {
//    console.log('GJM: Entered index.js function.');
    var contentHandler = new ContentHandler(db);

    // The main page of the LibraryApp
    app.get('/', contentHandler.displayMainPage);


//  Displays the form allowing a user to checkin or checkout a book. Only works for logged in users
    app.get('/bookloan', contentHandler.displayBookLoan);
//    app.post('/bookloan', contentHandler.handleBookLoan);

//  Displays the form allowing a user to add a new book or remove a book from library.
    app.get('/newbook', contentHandler.displayNewBookForm);
//    app.post('/newbook', contentHandler.handleNewBook);

//  Displays the form allowing a user to add a new patron or remove a patron from library. 
    app.get('/newpatron', contentHandler.displayNewPatronForm);
//    app.post('/newpatron', contentHandler.handleNewBook);

// Displays the form to see a report. For now it is called reportx
    app.get('/reportx', contentHandler.displayReportxForm);
    app.post('/reportx/', contentHandler.displayReportxForm);
    app.get('/reportx/loans', contentHandler.displayLoans);
    app.get('/reportx/due', contentHandler.displayBooksDue);
    app.get('/reportx/overdue', contentHandler.displayOverdueBooks);
    app.get('/reportx/lostbooks', contentHandler.displayMissingBooks);
    app.get('/reportx/newbooks', contentHandler.displayNewBooks);



    // Error handling middleware
    app.use(ErrorHandler);
//    console.log('GJM: Finished index.js function.');
}

module.exports = exports 
