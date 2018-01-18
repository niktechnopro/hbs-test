const express = require('express');
const app = express();
const path = require('path');
const sessions = require('express-sessions');
const router = require('./router/router');//loading router from routes folder
const bodyParser = require('body-parser');
const handleBars = require('express-handlebars');// we are going to use handlebars as view engine
const port = 3000;

//this is to read from form with method post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);//must tell to node to use router(we are loading on top) instead of app for routing

// middleware
app.use(express.static(__dirname + '/public')); //dirname here refers to root forlder where app lives


// let's setup the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handleBars({defaultLayout: 'main', extname: 'hbs', layoutsDir: __dirname + '/views/layouts'}));


app.listen(port, (error)=>{
    (!error) ? console.log('listening on port ', port) : console.log('something  went wrong')
})
