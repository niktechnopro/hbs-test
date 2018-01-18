console.log('loading router module')
var express = require('express');
var router = express.Router();
const pg = require('pg');
const format = require('pg-format');


// configuration for database
const config = {
    host: 'localhost',
    user: 'niktechnopro', //user name
    database: 'niktechnopro' //name of database
    // max: 10 //max number of clients in the pool if pool used instead of client
}
//connection to DB - if we using pool it reduces overhead(Pool is a construnctor for Pool object)
var pool = new pg.Pool(config); //defining the pool of clients
//now we can connec to database
pool.connect(function(error, done){
    (error)?console.log('we got an error',error):console.log('successful connect to database');
    // console.log('client', client)
})

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    let d = new Date();
    console.log('Time: ', d.toString())//just to log request time
    next()
})
// define the home page route(we using handler function chaining for one route)
router.route('/')
    .get((req, res)=>{
        console.log('serving a login page')
        res.render('login',{
            message: "if you are ready to login - fill in the info below"
        })
    })
    .post((req, res)=>{
        let email = req.body.email;
        let password = req.body.password;
        console.log('someone is trying to login', email, password)
        let ourQeury = format(`select * from test_table where email=$1 and password=$2`);
            let myClient = pool.query(ourQeury, [email, password], (error, result)=>{
            if (error){
                console.log("oops", error);
            }else{
                console.log('succesful read from database')
                // res.json({
                //     result: result.rows
                // })
                res.render('successlogin',{
                    
                })
            }
        })

    })
    .delete((req, res)=>{
        res.send("let's delete your account")//we'll use ajax request for it
    })

//registering routes info
router.route('/register')
    .get((req, res)=>{
        console.log('serving register page');
        res.render('register', {
            message: "be honest here"
        })
    })
    .post((req, res)=>{
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        let id = 1
        console.log('reading from register form: ', name, email, password)
//         INSERT INTO test_table (email, password, name)
// VALUES ('niktechnopro@gmail.com', 'aaa', 'Nik')
        var insertQeury = format(`INSERT INTO test_table (email, password, name) VALUES ($1,$2,$3);`);   //note diff placeholders from sql  
        let ourQeury = pool.query(insertQeury, [email, password, name], (error)=>{
            if (error){
                console.log('oops', error)
            }else{
                console.log('successful insertion into table');
                res.render('login',{
                    message: "now you can login"
                })
            }
        })
    })


module.exports = router;

//  router.route('/')
//     .post((req, res)=>{
//         console.log('someone showed up on post route');
//         res.end('post route got hit');
//     })
//     .get((req, res)=>{
//         console.log('someone showed up on our get route');
//             var ourQeury = format(`select * from test_table`)
//             var myClient = pool.query(ourQeury, (error, result)=>{
//             if (error){
//                 console.log(error);
//             }else{
//                 console.log('succesful read from database')
//                 res.json({
//                     result: result
//                 })
//             }
//         })
//     })