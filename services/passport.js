//inside here we'll put all passport configuration
const passport = require('passport');
const keys = require('../config/keys');
const GoogleStrategy = require('passport-google-oauth20').Strategy;//it exports several properties but we only care about strategy
const Users = require('../models/users');//loading table model
// done() is passport is similar to next in express - it takes 2 arguments error and result, if we not using error - we can use null instead
passport.use(new GoogleStrategy({//using google oauth strategy
    clientID : keys.googleClientID,
    clientSecret : keys.googleClientSecret,
    callbackURL : '/auth/google/callback' //route where user will be sent after they grant permission to our application
    }, (accessToken, refreshToken, profile, done) => {
        console.log('accesstoken', accessToken);
        console.log(profile.id);
        console.log(profile.emails[0].value);
        console.log(profile.displayName);
        Users.create({
            // email: profile.emails[0].value,
            email: 'some@email',
            password: 'something',
            name: profile.displayName

            // email: 'gogo@gmail.com',
            // password: 'testpassword',
            // name: 'my name'
        })
            .then(user => done(null, user))
            .catch(error => console.log(error))
        }
    )
);