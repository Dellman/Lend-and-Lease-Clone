// app/routes.js
'use strict';

const nodemailer = require('nodemailer');
var util = require('util');

var multer = require('multer');

/* Image functions */

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, '/home/kirk/Documents/lendandlease.app/public/images/');

    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ //multer settings
                storage: storage
  }).single('upload');

/** API path that will upload the files */

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rikstavling2016@gmail.com',
        pass: 'FTSF2016'
    }
});

var email_mottagare = 'rikstavling2016@gmail.com';

// setup email data with unicode symbols
let registeredMail = {
    from: '"Us at lend and LEASE!" <rikstavling2016@gmail.com>',
    to: 'rikstavling2016@gmail.com',// sender address
    subject: 'Successfully Registered to Lend and Lease', // Subject line
    text: 'You have successfully registered this email to lend and lease. Enjoy your stay!', // plain text body
    html: '<b>Hello world ?</b>' // html body
};
console.log(JSON.stringify(registeredMail));
registeredMail.to = JSON.stringify(email_mottagare);
console.log(JSON.stringify(registeredMail));


// send mail with defined transport object
/*transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});*/

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

    app.post('/upload', function(req, res) {
      console.log("upload IMAGE" + JSON.stringify(req.body));
        upload(req,res,function(err){
            if(err){
                  console.log(err);
                 res.json({error_code:1,err_desc:err});
                 return;
            }
              console.log(req.file.path);
             res.json({error_code:0,err_desc:null});
        });
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
    app.post('/login', alreadyLoggedIn, passport.authenticate('local-login', {
        successRedirect : '/successlogin', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
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
		failureRedirect : '/failureregister', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

  app.get('/successregister', function(req, res){
    res.send(new response_object(101, "Success at register"));
    console.log(req.user);
    connection.query("SELECT email FROM users WHERE user_id = '" + req.user + "'", function(err, result){
      if(!err && result.length > 0){
          console.log(" REGISTERED QUERY :" + result);
          console.log(" LENGTH of registered QUERY : " + result.length);
          registeredMail.to = JSON.stringify(result[0].email);
          console.log(JSON.stringify(registeredMail));
      }
      else{
          console.log(err);
      }

    });
  });

  app.get('/failureregister', function(req, res){
    res.send(new response_object(604, "That email is taken"));
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
      newItem.category = req.body.category.toLowerCase();

      var insertItemArray = [
          newItem.item_name,
          newItem.description,
          newItem.location,
          newItem.sub_date,
          newItem.start_date,
          newItem.end_date,
          newItem.user_id,
          newItem.category
      ]
      var insertItemQuery = "INSERT INTO items (item_name, description, location, sub_date, start_date, end_date, user_id, category) values ( ? )";

      console.log("InserItemArray : " + insertItemArray);

        switch(req.body.category) {
          case "Books":
          /* ADDING A BOOK TO THE DATABASE */
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
              /* ADD BOOK END */
          case "Electronics":
              /* ADD ELECTRONIC */
              var insertElectronicQuery = "INSERT INTO electronics (battery, brand, outside_use, electronic_category_id, electronic_id) values ( ? )";
              var newElectronic = new Object();
              newElectronic.battery = req.body.battery;
              newElectronic.brand = req.body.brand;
              if(req.body.outside_use = "Yes")
              {
                newElectronic.outside_use = 1;
              }
              else{
                newElectronic.outside_use = 0;
              }

              connection.query("SELECT electronic_category_id FROM electronic_categories WHERE electronic_category_name = '" + req.body.electronic_category_id + "'", function( err, rows){
                  if(!err){
                    console.log("Get category ID query rwos ELECTRONICS: " + JSON.stringify(rows));
                    console.log("GET CATEROGYR QUERY ROWS ELECTRONIC_CATEGORY ID " + rows[0].electronic_category_id);
                    newElectronic.electronic_category_id = rows[0].electronic_category_id;
                    console.log("NEW ELECTRONIC CATEGORY_ID : " + newElectronic.electronic_category_id);
                  }
                  else{
                    console.log(err);
                  }
              });

              var insert_electronic_item_id;
              connection.query(insertItemQuery, [insertItemArray], function (err, rows) {
                  if (err) {
                      console.log("Insertion failed");
                  }
                  else{
                    insert_electronic_item_id = rows.insertId;
                    console.log(rows.insertId);
                    console.log(JSON.stringify(rows));
                    newElectronic.electronic_id = insert_electronic_item_id;

                    var insertElectronicArray = [
                      newElectronic.battery,
                      newElectronic.brand,
                      newElectronic.outside_use,
                      newElectronic.electronic_category_id,
                      newElectronic.electronic_id
                    ]
                      console.log("Insert Electronic array : " + insertElectronicArray);

                      connection.query(insertElectronicQuery, [insertElectronicArray], function (err, rows) {
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
              /* ADD ELECTRONIC END*/
              break;
          case "Games":
              /* ADD GAME */
              var insertGameQuery = "INSERT INTO games (gamestudio, platform, date_released, game_category_id, game_id) values ( ? )";
              var newGame = new Object();
              newGame.gamestudio = req.body.gamestudio;
              newGame.platform = req.body.platform;
              newGame.date_released = req.body.date_released;

              connection.query("SELECT game_category_id FROM game_categories WHERE game_category_name = '" + req.body.game_category_id + "'", function( err, rows){
                  if(!err){
                    console.log("Get category ID query rwos GAME: " + JSON.stringify(rows));
                    console.log("GET CATEROGYR QUERY ROWS GAME_CATEGORY ID " + rows[0].game_category_id);
                    newGame.game_category_id = rows[0].game_category_id;
                    console.log("NEW GAME CATEGORY_ID : " + newGame.game_category_id);
                  }
                  else{
                    console.log(err);
                  }
              });

              var insert_game_item_id;
              connection.query(insertItemQuery, [insertItemArray], function (err, rows) {
                  if (err) {
                      console.log("Insertion failed");
                  }
                  else{
                    insert_game_item_id = rows.insertId;
                    console.log("ROWS INSERT ID I GAME: " + rows.insertId);
                    console.log(JSON.stringify(rows));
                    newGame.game_id = insert_game_item_id;

                    var insertGameArray = [
                      newGame.gamestudio,
                      newGame.platform,
                      newGame.date_released,
                      newGame.game_category_id,
                      newGame.game_id
                    ]
                      console.log("Insert GAMEc array : " + insertGameArray);

                      connection.query(insertGameQuery, [insertGameArray], function (err, rows) {
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
              /* ADD GAME END */
          case "Tools":
              /* ADD GAME */
              var insertToolQuery = "INSERT INTO tools (tool_category_id, tool_id) values ( ? )";
              var newTool = new Object();

              connection.query("SELECT tool_category_id FROM tool_categories WHERE tool_category_name = '" + req.body.tool_category_id + "'", function( err, rows){
                  if(!err){
                    console.log("Get category ID query rwos TOOL: " + JSON.stringify(rows));
                    console.log("GET CATEROGYR QUERY ROWS TOOL_CATEGORY ID " + rows[0].tool_category_id);
                    newTool.tool_category_id = rows[0].tool_category_id;
                    console.log("NEW TOOL CATEGORY_ID : " + newTool.tool_category_id);
                  }
                  else{
                    console.log(err);
                  }
              });

              var insert_tool_item_id;
              connection.query(insertItemQuery, [insertItemArray], function (err, rows) {
                  if (err) {
                      console.log("Insertion failed");
                  }
                  else{
                    insert_tool_item_id = rows.insertId;
                    console.log("ROWS INSERT ID I GAME: " + rows.insertId);
                    console.log(JSON.stringify(rows));
                    newTool.tool_id = insert_tool_item_id;

                    var insertToolArray = [
                      newTool.tool_category_id,
                      newTool.tool_id
                    ]
                      console.log("Insert Electronic array : " + insertToolArray);

                      connection.query(insertToolQuery, [insertToolArray], function (err, rows) {
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
          case 'Others':
          /* ADD GAME */
          var insertOtherQuery = "INSERT INTO others (other_id) values ( ? )";
          var newOther = new Object();

          var insert_other_item_id;
          connection.query(insertItemQuery, [insertItemArray], function (err, rows) {
              if (err) {
                  console.log("Insertion failed");
              }
              else{
                insert_other_item_id = rows.insertId;
                console.log("ROWS INSERT ID I GAME: " + rows.insertId);
                console.log(JSON.stringify(rows));
                newOther.other_id = insert_other_item_id;

                var insertOtherArray = [
                  newOther.other_id
                ]
                  console.log("Insert Electronic array : " + insertToolArray);

                  connection.query(insertOtherQuery, [insertOtherArray], function (err, rows) {
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

          default:
              console.log("The category " + req.body.category + " Didn't match any of the switches");
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
    if (req.isAuthenticated()){
        return next();
      }
      else{
    // if they aren't redirect them to the home page
        res.send(new response_object(602, "Not logged in"));
  }
}

function alreadyLoggedIn(req, res, next){
    if(req.isAuthenticated())
    {
        res.send(new response_object(605, "Already logged in"));
    }
    else{
      return next();
    }
  }

}
