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

var logged_in_user;

var response_status = function(code, message){
	this.code = code;
	this.message = message;
}

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


app.get('/profile', function(req,res){
    console.log("personal profile accessed");
    var sql = mysql.format("SELECT * FROM users WHERE email = ?", [logged_in_user]);
    connection.query(sql, function(err, rows, fields) {
        if(!err && rows.length == 1){
            res.send(rows[0]);
            console.log("success with query in view profile");
	    console.log(logged_in_user);
        }else if(sql == null){
		res.send("wrong LOGGED IN USER" + logged_in_user);
		console.log(logged_in_user);
        }
        else{
            console.log(logged_in_user);
        }

    });


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
            res.send(new response_status(101, "success at login"));
            console.log("success with query in login");
	    logged_in_user = post.email;
	    console.log(logged_in_user);
        }else if(rows.length == 0){
            res.send(new response_status(601, "Wrong username or password"));
            console.log(err);
        }
        else{
		console.log("MYSQL ERROR: " + err);
		console.log(rows.length);	
            	console.log("Something wrong at login" + post.email + "PASSWORD: " + post.password);
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


    var sql = mysql.format("SELECT * FROM items WHERE item_name = ? AND location = ?", [post.item_name, post.location]);

    connection.query(sql, function(err, rows, fields) {
        if(rows.length == 0){
            console.log(post);
            connection.query('INSERT INTO items SET ?', post, function(err, result){
                if(!err){
                    res.send(new response_status(102, "success at add item"));
                    console.log("success");
                }
                else{
                    res.send(new response_status(801, "Failed to add new item"));
                    console.log(err);
                }
            });
        }
        else{
            	console.log("ITEM ALREADY EXISTS: " + post.item_name);
		res.send(new response_status(802, "Item already added to users items"));	

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
    var sql = mysql.format("SELECT * FROM users WHERE email=?", [post.email]);

    connection.query(sql, function(err, rows, fields) {
        console.log("ROWS LENGTH IS: " + rows.length);

        if(rows.length == 0){
            connection.query('INSERT INTO users SET ?', post, function(err, result){
                if(!err){
                    res.send(new response_status(103, "success"));
                    console.log("user: " + post.email + " successfully registered");
                }
                else{
                    res.send(new response_status(701, "Failed to register user"));
                    console.log(err);
                }
            });
        }
        else{
            res.send(new response_status(702, "User with that email already exists"));
            console.log("EMAIL ALREADY IN USE !!! " + post.email);
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
    console.log(`+----------------------+-------------+--------------+-----------------------------------------------+
| Lend and Loan Server | Port : 3000 | Version: 0.1 | http://github.com/vuxnamannen/lendandloan.app |
+----------------------+-------------+--------------+-----------------------------------------------+`);
})

/* ******************* END OF SERVER INIT ********************************
 ************************************************************************ */
