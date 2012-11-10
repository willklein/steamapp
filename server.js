var express = require('express'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    app = express();

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.get('/', function(req, res) {
    res.render('index', {});
});

app.listen(3000);