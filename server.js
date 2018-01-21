const express = require('express');
const app = express();
const path = require('path');
//for any file that we write we do not have to include extension here
const router = require('./router/router');//loading router from routes folder
const bodyParser = require('body-parser');
const handleBars = require('express-handlebars');// we are going to use handlebars as view engine
var cookieParser = require('cookie-parser');
const cookieSession = require('express-session'); //for sessions
// var RedisStore = require('connect-redis')(session);//session store
const passport = require('passport');//generic logic to handle an idea of authentication in express - also requires at least one passport strategy
// startegy is something that helps you to authenticate with one very specific provider
require('./services/passport')//since it's not returning anything there is nothing to assign to passport config - therefore we load it just like a piece of code
 
const port = 3000;

// Client ID - public token
// 954411066439-bjljitk4698dlo2pdrhcsmfrf64jvlqn.apps.googleusercontent.com

// Client secret - private token
// F8cJ3FlwYI8jSpfd6H6IoCsQ

require('dotenv').config();//dotenv package would allow us to use credentials from .env package - it's only needed to connect database
// middleware

//this is to read from form with method post
app.use(express.static(__dirname + '/public')); //dirname here refers to root forlder where app lives
app.use(bodyParser.urlencoded({ extended: false }));
// very important - the following three must be in that order or sessions won't work
app.use(cookieParser());
app.use(cookieSession({//setting up session
    secret: "supersecretsessionstring", //used to sign session cookie
    resave: false, //determines if session should be updated wheather or not user may not have a change to a session specifically-basically updates every time page reloaded
    saveUninitialized: false,//creates session and cookie for us whenever a user visits the page
    cookie : {secure: false} //true only when we have https
}))//saveUninitialized - saves uninitialized objects in the session
// router middleware must be after session otherwise it would not work

//initializes passport
app.use(passport.initialize());
app.use(passport.session())//passport integrates with session

app.use(router);//must tell to node to use router(we are loading on top) instead of app for routing

// let's setup the view engine and directory for templates
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', handleBars({defaultLayout: 'main', extname: 'hbs', layoutsDir: __dirname + '/views/layouts'}));

//route for google
//google strategy has an internal identifier of google,
// scope specifies with google(google internaly has a list of scopes and permissions that we can ask for from users account)
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/auth/google/callback', passport.authenticate('google'));

router.get('/api/logout', (req, res)=>{
    req.logout(); //clears the cookie-req.user is destroyed by passport
    res.send(req.user);//if succesful logout - will be undefined
})

router.get('/api/current_user', (req, res)=>{
    res.send(req.user)
})

// method to serialize user for storage
passport.serializeUser(function(user, done) {//where user is a user model-object that represents the user;
//done is some callback that we have to call after we have done some work with passport, first argument to done - error object if one exists
    done(null, user.id);
  });

// method to de-serialize back for auth - extracting user model back from the cookie
passport.deserializeUser(function(id, done) {
       done(null, user);
  });

app.listen(port, (error)=>{
    (!error) ? console.log('listening on port ', port) : console.log('something  went wrong')
})
