// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var mongoose = require('mongoose');
var mysql      = require('mysql');

var app      = express();
// var port     = process.env.PORT || 8080;
var port = 3000;
var passport = require('passport');
var flash    = require('connect-flash');

var fs = require('fs');
var util = require('util');


var connection = mysql.createConnection({
    host     : '198.211.126.133',
    user     : 'admin',
    password : 'password',
    database : 'lendandloan'
});

connection.connect();




 app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
 });

// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration



// set up our express application
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser()); // get information from html forms
app.use(bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/images' }));
app.use(cookieParser()); // read cookies (needed for auth)
app.set('view engine', 'ejs'); // set up ejs for templating
// set up our express application
app.use(morgan('dev')); // log every request to the console
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
