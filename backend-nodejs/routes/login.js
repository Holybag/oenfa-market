var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var jwt = require('jsonwebtoken');

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

var tokenKey = 'oenfa2020';

/////// mongodb //////
const url = 'mongodb://localhost:27017';
const dbName = 'oenfamarket';
var db = null;
mongo.MongoClient.connect(url, function(err, client) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected successfully to mongodb');
        db = client.db(dbName);
    }
});

router.get('/', function(req, res, next){
    const loginCollection = db.collection('login');
    loginCollection.find({}).toArray(function (error, results) {
        if (error) {
            res.send(error);
        } else {
            res.send(results);
        }
    });
});

/* Login Check REST API */
router.post('/loginCheck', function(req, res, next){
    var email = req.body.email;
    var token = req.body.token;

    jwt.verify(token, tokenKey, function(error, decoded) {
        if(error){
            var data = {
                    "success": false,
                    "message": error.name,
                    "errors": error.message,
                    "data": error.expiredAt
                };   
            //console.log(data);            
            res.send(data);
        }else{
            var data = {
                "success": true,
                "message": null,
                "errors": null,
                "data": decoded
            };
            //console.log(data);
            res.send(data);
        }
    });
});

router.post('/', function(req, res, next){
    let email = req.body.email;
    let password = req.body.password;

    if (!email) {
        res.send({ result: false, message: 'no email'});
        return;
    } else if(!password) {
        res.send({ result: false, message: 'no password'});
        return;
    }

    const usersCollection = db.collection('users');
    const loginCollection = db.collection('login');
    usersCollection.find({ email: email, password: password}).count(function(error, count){
        if (error) {
            res.send(error);
        } else if (count){
            let payLoad = { 'userId': email };
            let token = jwt.sign(payLoad, tokenKey, {
                algorithm: 'HS256',
                expiresIn: 600
            });
            console.log('token:', token);
            
            loginCollection.deleteOne({
                email: email
            }, function(error, result){
                if (error) {
                    res.send(error);
                } else {
                    loginCollection.insertOne({
                        email: email,
                        loginTime: new Date(),
                        token: token
                    }, function(error, result){
                        if (error) {
                            res.send(error);
                        } else {
                            res.send({ result: true, email: email, token: token });
                        }
                    });
                }
            });
        }
    });

});

router.delete('/', function(req, res, next){
    try {
        console.log('logout headers authorization:', req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.decode(token);
        
        if (decoded === null){
            console.log('decoded is null');
            res.send({ success: false, message: 'decoded is null', error: null, data: null });
            return;
        }
        console.log('decoded value:', decoded);
            
        if (decoded.userId) {
            const loginCollection = db.collection('login');
            loginCollection.deleteMany({
                    email: decoded.userId
            }, function(error, result){
                if (error) {
                    res.send({ success: false, message: 'Exception occured', error: error, data: null });
                    console.log('Exception occured');
                } else {
                    console.log('Logout succeed');                        
                    res.send({ success: true, message: 'Logout succeed', error: null, data: null});
                }
            });
        } else {
            //console.log('There is no email in token');
            res.send({ success: false, message: 'There is no email in token', error: null, data: null });
        }
    
    } catch (error) {
        console.log(error);
        //res.send({ success: false, message: 'Exception occured', error: error, data: null });
    }
});

module.exports = router;