var express = require('express'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    app = express();

require('./config')(app);

//connect to the db
mongoose.connect(process.env.DB_URL || 'mongodb://localhost/hartfordJS');

// Load all controllers
fs.readdir('./controllers', function(err, files){
    files.forEach(function(fileName){
        require('./controllers/' + fileName)(app)
    });
});

app.listen(process.env.PORT || 3000);