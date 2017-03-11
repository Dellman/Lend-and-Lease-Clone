// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

// methods ======================
// generating a hash
function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
function validPassword(password, savedpass) {
    return bcrypt.compareSync(password, savedpass);
};


var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '198.211.126.133',
    user: 'admin',
    password: 'password',
    database: 'lendandloan'
});

connection.connect();

// load up the user model
//var User            = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session


    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        console.log("serialize User: " + JSON.stringify(user));
        console.log("serialize user id " + user.id);
        if(user.user_id == null){
            done(null, user.id);
          }
          else{
            done(null, user.user_id);
          }
    });

    // used to deserialize the user WE HAVE TO FIGURE OUT HOW WE IMPLEMENT THIS PROPEPERLY http://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
    /*  passport.deserializeUser(function (id, done) {
     console.log("HELLO FROM deserializeUser");
     connection.query("select * from users where user_id = " + id, function (err, rows) {
     done(err, rows[0]);
     });
     }); */

    /*passport.deserializeUser(function(user_id, done) {
     user.findById(user_id, function(err, user) {
     done(err, user);
     });
     });*/
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            console.log("local-signup req: " + req);
            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                connection.query("select * from users where email = '" + email + "'", function (err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length > 0) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    }
                    else {
                        var newUserMysql = new Object();
                        newUserMysql.email = email;
                        newUserMysql.password = generateHash(password);
                        newUserMysql.first_name = req.body.first_name;
                        newUserMysql.last_name = req.body.last_name;
                        newUserMysql.address = req.body.address;
                        newUserMysql.date_of_birth = req.body.date_of_birth;
                        newUserMysql.phone = req.body.phone;

                        var insertArray = [
                            newUserMysql.email,
                            newUserMysql.password,
                            newUserMysql.first_name,
                            newUserMysql.last_name,
                            newUserMysql.phone,
                            newUserMysql.date_of_birth,
                            newUserMysql.address
                        ]

//                        var insertQuery = "INSERT INTO users ( email, password, first_name, last_name, phone, dob, address ) values ('" + newUserMysql.email + "','" + newUserMysql.password + "')";
                        var insertQuery = "INSERT INTO users ( email, password, first_name, last_name, phone, dob, address ) values ( ? )";
                        connection.query(insertQuery, [insertArray], function (err, rows) {
                            if (err) {
                                console.log("Insertion failed");
                            }
                            newUserMysql.id = rows.insertId;

                            return done(null, newUserMysql);
                        });
                    }
                });
            })
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            console.log("local-login email print : " + email);

            var queryString = "SELECT * FROM users WHERE email = '" + email + "'";

            console.log("local-login query string : " + queryString);

            connection.query(queryString, function (err, rows) {
                console.log("rows0 password print :" + rows[0].password);
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!validPassword(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });

        })
    );



};
