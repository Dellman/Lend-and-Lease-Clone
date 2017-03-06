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
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {

        connection.query("select * from users where id = " + id, function (err, rows) {
            done(err, rows[0]);
        });

        /*User.findById(id, function(err, user) {
         done(err, user);
         });
         */
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

                        var insertQuery = "INSERT INTO users ( email, password ) values ('" + newUserMysql.email + "','" + newUserMysql.password + "')";
                        console.log(insertQuery);
                        connection.query(insertQuery, function (err, rows) {
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
            connection.query("SELECT * FROM users WHERE email = '" + email + "'", function (err, rows) {
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
    )

};
