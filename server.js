var express = require('express');
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(morgan('dev'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(session({ secret: 'adebisi'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var logged_in_user;


function isLoggedIn(req, res, next){

      if (req.isAuthenticated())
        return next();

      res.redirect('/');


}

var response_status = function(code, message){
	this.code = code;
	this.message = message;
}

/* ***************** SQL SECTION *********************
 ****************************************************** */
/*var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'lendandloan'
});

connection.connect(); */

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

/* ******************END OF WEB APP SECTION ***************************
 ********************************************************************* */

/* *********************** SERVER INIT ******************************** */
app.listen(3000, function () {
    console.log(`+----------------------+-------------+--------------+-----------------------------------------------+
| Lend and Loan Server | Port : 3000 | Version: 0.1 | http://github.com/vuxnamannen/lendandloan.app |
+----------------------+-------------+--------------+-----------------------------------------------+`);
})

/* ******************* END OF SERVER INIT ********************************
 ************************************************************************ */
