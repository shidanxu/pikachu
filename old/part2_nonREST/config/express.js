// setup modules
var express = require('express');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var expressSession = require('express-session');
// setup database
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/'+config.dbName);
module.exports = function (app) {

// view engine setup
app.set('views', config.views_path);
app.set('view engine', 'ejs');
app.set('env', 'development');

// for qunit test
app.options('/mfa/*', function(req, res){
  console.log("writing headers only");
  res.header("Access-Control-Allow-Origin", "*");
});
/*
*/
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(busboy()); 

// app.use(bodyParser({ 
//     keepExtensions: true, 
//     uploadDir: config.upload_path,
//     limit: '200mb'
//   }));

app.use(cookieParser());
app.use(express.static(config.public_path));
app.use(express.static(config.test_path));
app.use(expressSession({
    secret: config.expSession.secret,
    cookie: {
        maxAge: config.expSession.maxAge
    }
}));

// setup routes
require(config.config_path+'routes');

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

}
