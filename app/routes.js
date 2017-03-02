module.exports = function(app, passport) {

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('http://localhost:3000/itemsList', function(req,res){
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
  });
/* GAMLA LOGIN HANDLERN */
/*  app.post('/login', function(req, res){
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

  }); */

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
  	    console.log(sql);
        connection.query(sql, function(err, rows, fields) {
            if(rows == null || rows.length == 0){
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

      res.sendFile('index.html', { root: __dirname + '/../public/'});

  });


      // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the homepage if there is an error
    failureFlash : true // allow flash messages
  }));

}
