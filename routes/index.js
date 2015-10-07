var  ContentHandler = require('./content')

function routes (app, db) {
    console.log('Entered index.js function.')
    var contentHandler = new ContentHandler(db, app.url);
    console.log('in routes, the  url :' +  app.url);

    //route gets.
    app.get('/', contentHandler.displayMainPage);
    app.get('/bookloan', contentHandler.displayBookLoans);
    app.get('/managebooks', contentHandler.displayNewBook);
    app.get('/managepatrons', contentHandler.displayNewPatron);
    app.get('/viewreports', contentHandler.displayReports); 
   
    // route posts.
//  app.post('/viewreportx', contentHandler.displayReportx);
    app.post('/bookloanf',   contentHandler.displayFiltered);
    app.post('/bookloanco',  contentHandler.handleBookCheckout);
//    app.post('/bookloanci',  contentHandler.handleBookCheckin);

    console.log('Finished index.js function.')
}
module.exports = routes
