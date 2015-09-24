var  ContentHandler = require('./content')

function routes (app, db) {
    console.log('Entered index.js function.')
    var contentHandler = new ContentHandler(db, app.url);
    console.log('in routes, the  url :' +  app.url);
    // The main page of the blog
    app.get('/', contentHandler.displayMainPage);
    app.get('/bookloan', contentHandler.displayBookLoans);
    app.get('/managebooks', contentHandler.displayNewBook);
    app.get('/managepatrons', contentHandler.displayNewPatron);
    app.get('/viewreports', contentHandler.displayReportx);
   
    app.post('/viewreports', contentHandler.displayReport);
    


    console.log('Finished index.js function.')
}
module.exports = routes
