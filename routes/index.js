var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
/* GET Hello world page */
router.get('/helloworld', function (req, res) {
    res.render('helloworld', {title: 'Hello,World'});
});
/*GET userlist page*/
router.get('/userlist', function (req, res) {
    var db = req.db;
    console.log('reqdb', req.db);
    var collection = db.get('usercollection');
    collection.find({}, {}, function (e, docs) {
        res.render('userlist', {
            'userlist': docs
        })
    });
});
/*GET New user page*/
router.get('/newuser', function (req, res) {
    res.render('newuser', {title: 'Add New User'});
});
/*POST to Add User Service*/
router.post('/adduser', function (req, res) {
    //Set out internal DB variable
    var db = req.db;
    //Get our form values . These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    //Set out collection
    var collection = db.get('usercollection');
    //Submint to the DB
    collection.insert({
        "username": userName,
        "email": userEmail
    }, function (err, doc) {
        if(err) {
            res.send('There was a problem adding the information to the database.')
        }
        else {
            res.redirect('userlist');
        }
    })
});
module.exports = router;
