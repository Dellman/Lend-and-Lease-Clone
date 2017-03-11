// app/routes.js
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '198.211.126.133',
    user: 'admin',
    password: 'password',
    database: 'lendandloan'
});

connection.connect();

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.sendFile('index.html', { root: __dirname + '/../public/'});
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
	/*	app.get('/login', function(req, res) {

	 // render the page and pass in any flash data if it exists
	 res.render('login.ejs', { message: req.flash('loginMessage') });
	 });
	 */
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : false // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
	// process the signup form
	app.post('/register', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
		app.get('/profile', isLoggedIn, function(req, res) {

			console.log("REQUEST USER " + req.user);

			var profileQuery = "SELECT * FROM users WHERE user_id = '" + req.user + "'";

		 	connection.query(profileQuery, function (err, result) {
				if(!err){
					console.log(result);
					res.send(result);
				}
				else{
					console.log(err);
					console.log(result);
				}
			});
		});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

    // process the signup form
    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
		/* WE GET THE PACKET OF THE ROW IN THE TABLE WHERE THE USER IN THE SESSION IS STORED

		 TODO: IMPLEMENT SESSIONS FOR MULTIPLE USERS */
        console.log("REQUEST USER " + req.user);
		/*res.render('profile.ejs', {
		 user : req.user // get the user out of session and pass to template
		 });*/

        var profileQuery = "SELECT * FROM users WHERE user_id = '" + req.user + "'";

        connection.query(profileQuery, function (err, result) {
            if(!err){
                console.log(result);
                res.send(result);
            }
            else{
                console.log(err);
                console.log(result);
            }
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================

app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

app.get('/subCategories', isLoggedIn, function(req, res) {
  var subCategories = [];
  var book_categories = "SELECT book_category_name FROM book_categories";
  var electronic_categories = "SELECT electronic_category_name FROM electronic_categories";
  var game_categories = "SELECT game_category_name FROM game_categories";
  var tool_categories = "SElECT tool_category_name FROM tool_categories";
  connection.query(book_categories, function (err, result){
      if(!err){
        subCategories.push(result);
        console.log(result);
      }
      else{
        console.log(err);
        console.log(result);
      }
  });
  connection.query(electronic_categories, function (err, result){
      if(!err){
        subCategories.push(result);
        console.log(result);
      }
      else{
        console.log(err);
        console.log(result);
      }
  });
  connection.query(game_categories, function (err, result){
      if(!err){
        subCategories.push(result);
        console.log(result);
      }
      else{
        console.log(err);
        console.log(result);
      }
  });
  connection.query(tool_categories, function (err, result){
      if(!err){
        subCategories.push(result);
        console.log(result);
      }
      else{
        console.log(err);
        console.log(result);
      }
  });

  res.send(subCategories);

});


// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

}
