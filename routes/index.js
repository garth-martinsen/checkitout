var  ContentHandler = require('./content')

function routes (app, db) {
    console.log('Entered index.js function.')
    var contentHandler = new ContentHandler(db, app.url);
    console.log('in routes, the  url :' +  app.url);
    app.get('/', contentHandler.displayMainPage);
    app.get('/bookloan', contentHandler.displayBookLoans);
    app.get('/managebooks', contentHandler.displayNewBook);
    app.get('/managepatrons', contentHandler.displayNewPatron);
    app.get('/viewreports', contentHandler.displayReports); 
    app.get('/checkins', contentHandler.displayCheckins);

//  app.post('/viewreportx', contentHandler.displayReportx);
    app.post('/bookloanf',   contentHandler.displayFilteredBooks);
    app.post('/bookloanco',  contentHandler.handleBookCheckout);
    app.post('/bookloanci',  contentHandler.handleBookCheckin);
    app.post('/checkinf',   contentHandler.displayFilteredPatrons);
    app.post('/checkin',   contentHandler.handleBookCheckin);

    console.log('Finished index.js function.')
}
module.exports = routes
