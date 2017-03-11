// app/routes.js
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '198.211.126.133',
    user: 'admin',
    password: 'password',
    database: 'lendandloan'
});

var response_object = function(code, message){
  this.code = code;
  this.message = message;
}

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
        successRedirect : '/successlogin', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : false // allow flash messages
    }));

    app.get('/successlogin', function(req, res){
      res.send(new response_object(101, "Success at login"));
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
	// process the signup form
	app.post('/register', passport.authenticate('local-signup', {
		successRedirect : '/successregister', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

  app.get('/successregister', function(req, res){
    res.send(new response_object(101, "Success at register"));
  });

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
    res.send("Success on logout");
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
        res.send(new response_object(101, "Successfully logged out"));
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

            connection.query(electronic_categories, function (err, result){
                if(!err){
                  subCategories.push(result);

                          connection.query(game_categories, function (err, result){
                              if(!err){
                                subCategories.push(result);

                                        connection.query(tool_categories, function (err, result){
                                            if(!err){
                                              subCategories.push(result);
                                              console.log(subCategories);
                                              res.send(subCategories);

                                            }
                                            else{
                                              console.log(err);
                                            }
                                        });
                              }
                              else{
                                console.log(err);
                              }
                          });
                }
                else{
                  console.log(err);
                }
            });
      }
      else{
        console.log(err);
      }
  });
});

app.post('/addItem', isLoggedIn, function(req, res){

  console.log("Request body: " + JSON.stringify(req.body));
  console.log("Request user: " + JSON.stringify(req.user));

  var newItem = new Object();
  newItem.item_name = req.body.item_name;
  newItem.description = req.body.description;
  newItem.location = req.body.location;
  newItem.sub_date = req.body.submission_date;
  newItem.start_date = req.body.start_date;
  newItem.end_date = req.body.end_date;
  newItem.user_id = req.user;

  var insertItemArray = [
      newItem.item_name,
      newItem.description,
      newItem.location,
      newItem.sub_date,
      newItem.start_date,
      newItem.end_date,
      newItem.user_id
  ]
  var insertItemQuery = "INSERT INTO items (item_name, description, location, sub_date, start_date, end_date, user_id) values ( ? )";

  console.log("InserItemArray : " + insertItemArray);

    switch(req.body.category) {
      case "Books":
          var insertBookQuery = "INSERT INTO books (book_id, author, ISBN, date_published, book_category_id) values ( ? )";
          var newBook = new Object();
          newBook.author = req.body.author;
          newBook.ISBN = req.body.ISBN;
          newBook.date_published = req.body.date_published;
          var category_id;

          connection.query("SELECT book_category_id FROM book_categories WHERE book_category_name = '" + req.body.book_category_id + "'", function( err, rows){
              if(!err){
                console.log("Get category ID query rwos : " + JSON.stringify(rows));
                console.log("GET CATEROGYR QUERY ROWS BOOK_CATEGORY ID " + rows[0].book_category_id);
                newBook.book_category_id = rows[0].book_category_id;
                console.log("NEW BOOK BOOK CATEGORY_ID : " + newBook.book_category_id);
              }
              else{
                console.log(err);
              }
          });

          var insert_item_id;
          connection.query(insertItemQuery, [insertItemArray], function (err, rows) {
              if (err) {
                  console.log("Insertion failed");
              }
              else{
                insert_item_id = rows.insertId;
                console.log(rows.insertId);
                console.log(JSON.stringify(rows));
                newBook.book_id = insert_item_id;

                var insertBookArray = [
                  newBook.book_id,
                  newBook.author,
                  newBook.ISBN,
                  newBook.date_published,
                  newBook.book_category_id
                ]
                  console.log("Insert Book array : " + insertBookArray);

                  connection.query(insertBookQuery, [insertBookArray], function (err, rows) {
                      if (err) {
                        console.log(err);
                      }
                      else{
                        insert_item_id = rows.insertId;
                        console.log(JSON.stringify(rows));
                        res.send(new response_object(101, "success"));
                      }
                  });
              }
          });
          break;

      case "Orange":
          break;
      case "Apple":
          break;
      default:
          console.log("Reached default");
  }

});

app.get('/items', function(req, res){
  connection.query("select * from items", function(err, rows){
    if(!err)
    {
        res.send(rows);
    }
    else{
      console.log(err);
    }
  });
});

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.send(new response_object(602, "Not logged in"));
}

}
