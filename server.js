var express = require('express');
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* ***************** SQL SECTION *********************
****************************************************** */
var connection = mysql.createConnection({ 
	host : 'localhost',
	user : 'root',
	password : 'password',
	database : 'lendandloan'
});

connection.connect();

app.get('/items', function(req,res){
	console.log("items_page accessed");
connection.query('SELECT * FROM items', function(error, result, fields){
	res.send(result);
	console.log("connected");
})
})

app.post('/login', function(req, res){
	console.log("login_page accessed");
	var post = {
		email: req.body.email,
		password: req.body.password
	};
	console.log(post);
	var sql = mysql.format("SELECT * FROM (SELECT * FROM users WHERE email = ?) AS filter WHERE password = ?", [post.email, post.password]);
	console.log(sql);
	connection.query(sql, function(err, rows, fields) {
	if(!err && rows.length == 1){
		res.send("success");
		console.log("success with query in login");
	}else if(sql == null){
		res.send("fail");
		console.log(err);
	}
	else{
		console.log("MULTIPLE ENTRIES OF SAME USER WITH SAME PASSWORD");
	}

	});

});

app.post('/additem', function(req, res){
	console.log("additem_page accessed");
	var post = {
		item_name: req.body.item_name,
		description: req.body.description,
		category: req.body.category,
		submission_date: req.body.submission_date,
		expiration_date: req.body.expiration_date,
		location: req.body.location
	};
	console.log(post);
	connection.query('INSERT INTO items SET ?', post, function(err, result){
	if(!err){
		res.send("success");
		console.log("success");
	 }
	else{
		res.send("fail");
		console.log(err);
	}
	});

});


app.post('/register', function(req, res){
	console.log("register_page accessed");
	var post = {
		last_name: req.body.last_name,
		first_name: req.body.first_name,
		address: req.body.address,
		date_of_birth: req.body.date_of_birth,
		email: req.body.email,
		phone: req.body.phone,
		password: req.body.password
	};
	console.log(post);
	connection.query('INSERT INTO users SET ?', post, function(err, result){
	if(!err){
		res.send("success");
		console.log("success");
	 }
	else{
		res.send("fail");
		console.log(err);
	}
	});

});
/* *********************** END OF SQL SECTION ***********************
******************************************************************** */

/* *********************** WEB APP SECTION ***************************
********************************************************************* */
app.get('/', function(req, res){

	res.sendFile(public/index.html);

});

/* ******************END OF WEB APP SECTION ***************************
********************************************************************* */

/* *********************** SERVER INIT ******************************** */
app.listen(3000, function () {
console.log('listening on port 3000');
})

/* ******************* END OF SERVER INIT ********************************
************************************************************************ */
