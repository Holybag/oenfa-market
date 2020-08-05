var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var jwt = require('jsonwebtoken');

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

//var tokenKey = 'oenfa2020';

const config = process.env.NODE_ENV === "prod"
    ? require("../application.prod.json")
    : require("../application.dev.json");

var tokenKey = config.auth.tokenKey;

// /////// mongodb //////
// const url = 'mongodb://localhost:27017';
// const dbName = 'oenfamarket';
// var db = null;
// mongo.MongoClient.connect(url, function(err, client) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('Connected successfully to mongodb');
//         db = client.db(dbName);
//     }
// });


/* for test */
router.get('/', function (req, res, next) {
    const db = req.app.locals.db;
    const loginCollection = db.collection('login');
    loginCollection.find({}).toArray(function (error, results) {
        if (error) {
            let formatted = {
                success: false,
                message: null,
                errors: error,
                data: null
            };
            res.send(formatted);
        } else {
            let formatted = {
                success: true,
                message: null,
                errors: null,
                data: results
            };
            res.send(formatted);
        }
    });
});

/* Login Check REST API */
router.post('/loginCheck', function (req, res, next) {
    //var email = req.body.email;
    var token = req.body.token;

    jwt.verify(token, tokenKey, function (error, decoded) {
        if (error) {
            var data = {
                "success": false,
                "message": error.name,
                "errors": error.message,
                "data": error.expiredAt
            };
            //console.log(data);            
            res.send(data);
        } else {
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

// 로그인 여부 체크 확인하는 조회. (이메일 가입자)
// 사용자 DB를 조회하고 존재하는 경우 로그인 테이블에서 사용자 정보를 업데이트 함.
router.post('/', function (req, res, next) {
    console.log("login router.post");
    let email = req.body.email;
    let password = req.body.password;

    if (!email) {
        res.send({ result: false, message: 'no email' });
        return;
    } else if (!password) {
        res.send({ result: false, message: 'no password' });
        return;
    }

    const db = req.app.locals.db;
    const usersCollection = db.collection('users');
    const loginCollection = db.collection('login');
    usersCollection.find({ email: email, password: password }).count(function (error, count) {
        /* 상용 적용시 변경 */
        //usersCollection.find({ email: email, password: password, authstatus: 1}).count(function(error, count){
        console.log("count", count);
        console.log("error", error);
        if (error) {
            console.log('error');
            var data = {
                "success": false,
                "message": null,
                "errors": error,
                "data": null
            };
            res.send(data);
        } else if (count === 0) {
            console.log('count === 0');
            var data = {
                "success": false,
                "message": 'count is 0',
                "errors": null,
                "data": null
            };
            res.send(data);
        } else if (count) {
            console.log('count');
            //let payLoad = { 'userId': email };
            let payLoad = { 'userId': email };
            
            let token = jwt.sign(payLoad, tokenKey, {
                algorithm: 'HS256',
                expiresIn: 60000
            });
            console.log('token:', token);

            loginCollection.deleteOne({
                // email: email
                repId: email
            }, function (error, result) {
                if (error) {
                    var data = {
                        "success": false,
                        "message": null,
                        "errors": error,
                        "data": null
                    };
                    res.send(data);
                } else {
                    loginCollection.insertOne({
                        //email: email,
                        repId: email,
                        
                        loginTime: new Date(),
                        token: token
                    }, function (error, result) {
                        if (error) {
                            var data = {
                                "success": false,
                                "message": null,
                                "errors": error,
                                "data": null
                            };
                            res.send(data);
                        } else {
                            var data = {
                                "success": true,
                                "message": null,
                                "errors": null,
                                "data": { result: true, email: email, token: token }
                            };
                            res.send(data);
                        }
                    });
                }
            });
        }
    });

});

// 구글 로그인 여부 체크 확인하는 조회.
// 사용자 DB를 조회하고 없는 경우 사용자 정보 생성
// 존재하는 경우 로그인 테이블에서 사용자 정보를 업데이트 함.
router.post('/google/', function (req, res, next) {
    console.log("login process for google ");
    const classify = 'google';
    let email = req.body.email;
    let googleId = req.body.googleId;
    let name = req.body.name;
    let imageUrl = req.body.imageUrl;

    if (!email) {
        res.send({ result: false, message: 'no email' });
        return;
    } else if (!googleId) {
        res.send({ result: false, message: 'no googleId' });
        return;
    }

    const db = req.app.locals.db;
    const usersCollection = db.collection('users');
    usersCollection.find({ repId: googleId }).toArray(function (error, results) {
    //usersCollection.find({ classify: classify, email: email, googleId: googleId }).toArray(function (error, results) {
        /* 상용 적용시 변경 */
        //usersCollection.find({ email: email, googleId: googleId, authstatus: 1}).count(function(error, count){
        if (error) {
            console.log('error');
            var data = {
                "success": false,
                "message": null,
                "errors": error,
                "data": null
            };
            res.send(data);
        } else {
            console.log('success');
            //console.log("results", results);

        }

        console.log("results.length", results.length);
        //console.log("count2", count);
        if (results.length === 0) {
            //console.log('count === 0');
            // user 테이블에 사용자가 없는 경우.
            // user 테이블에 사용자 정보 생성
            usersCollection.insertOne({
                classify: classify,
                repId: googleId,
                email: email,
                // googleId: googleId,
                name: name,
                imageUrl: imageUrl,
                createdAt: new Date(),
                updatedAt: new Date()
            }, function (error, result) {
                if (error) {
                    var data = {
                        "success": false,
                        "message": null,
                        "errors": error,
                        "data": null
                    };
                    res.send(data);
                } else {
                    var data = {
                        "success": true,
                        "message": null,
                        "errors": null,
                        "data": { result: true, email: email }
                    };
                    //res.send(data);
                }
            });
        }


        console.log("google");

        //let payLoad = { 'userId': email };
        let payLoad = { 'userId': googleId };
        let token = jwt.sign(payLoad, tokenKey, {
            algorithm: 'HS256',
            expiresIn: 60000
        });
        console.log('token:', token);

        const loginCollection = db.collection('login');
        loginCollection.deleteOne({
            //email: email
            repId: googleId
        }, function (error, result) {
            if (error) {
                var data = {
                    "success": false,
                    "message": null,
                    "errors": error,
                    "data": null
                };
                res.send(data);
            } else {
                loginCollection.insertOne({
                    repId: googleId,
                    //email: email,
                    loginTime: new Date(),
                    token: token
                }, function (error, result) {
                    if (error) {
                        var data = {
                            "success": false,
                            "message": null,
                            "errors": error,
                            "data": null
                        };
                        res.send(data);
                    } else {
                        var data = {
                            "success": true,
                            "message": null,
                            "errors": null,
                            "data": { result: true, email: email, token: token }
                        };
                        res.send(data);
                    }
                });
            }
        });
    });
});



// 페이스북 로그인 여부 체크 확인하는 조회.
// 사용자 DB를 조회하고 없는 경우 사용자 정보 생성
// 존재하는 경우 로그인 테이블에서 사용자 정보를 업데이트 함.
router.post('/facebook/', function (req, res, next) {
    console.log("login process for facebook ");
    const classify = 'facebook';
    let email = req.body.email;
    let facebookId = req.body.facebookId;
    let name = req.body.name;
    console.log("name", name);


    if (!email) {
        res.send({ result: false, message: 'no email' });
        return;
    } else if (!facebookId) {
        res.send({ result: false, message: 'no facebookId' });
        return;
    }

    const db = req.app.locals.db;
    const usersCollection = db.collection('users');
    const loginCollection = db.collection('login');
    usersCollection.find({ repId: facebookId }).count(function (error, count) {
    //usersCollection.find({ classify: classify, email: email, facebookId: facebookId }).count(function (error, count) {
        /* 상용 적용시 변경 */
        //usersCollection.find({ email: email, googleId: googleId, authstatus: 1}).count(function(error, count){
        console.log("count", count);
        console.log("error", error);
        if (error) {
            console.log('error');
            var data = {
                "success": false,
                "message": null,
                "errors": error,
                "data": null
            };
            res.send(data);
        } else {
            console.log('success');
        }


        console.log("count2", count);
        if (count === 0) {
            console.log('count === 0');
            // user 테이블에 사용자가 없는 경우.
            // user 테이블에 사용자 정보 생성
            usersCollection.insertOne({
                classify: classify,
                repId: facebookId,
                email: email,
                name: name,
                createdAt: new Date(),
                updatedAt: new Date()
            }, function (error, result) {
                if (error) {
                    var data = {
                        "success": false,
                        "message": null,
                        "errors": error,
                        "data": null
                    };
                    res.send(data);
                } else {
                    var data = {
                        "success": true,
                        "message": null,
                        "errors": null,
                        "data": { result: true, email: email }
                    };
                    //res.send(data);
                }
            });
        }

        console.log("facebookId");

        //console.log('count');
        let payLoad = { 'userId': facebookId };
        //let payLoad = { 'userId': email };
        let token = jwt.sign(payLoad, tokenKey, {
            algorithm: 'HS256',
            expiresIn: 60000
        });
        console.log('token:', token);

        loginCollection.deleteOne({
            repId: facebookId
            //email: email
        }, function (error, result) {
            if (error) {
                var data = {
                    "success": false,
                    "message": null,
                    "errors": error,
                    "data": null
                };
                res.send(data);
            } else {
                loginCollection.insertOne({
                    repId: facebookId,
                    loginTime: new Date(),
                    token: token
                }, function (error, result) {
                    if (error) {
                        var data = {
                            "success": false,
                            "message": null,
                            "errors": error,
                            "data": null
                        };
                        res.send(data);
                    } else {
                        var data = {
                            "success": true,
                            "message": null,
                            "errors": null,
                            "data": { result: true, email: email, token: token }
                        };
                        res.send(data);
                    }
                });
            }
        });

    });
});



router.delete('/', function (req, res, next) {
    try {
        console.log('logout headers authorization:', req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.decode(token);

        if (decoded === null) {
            console.log('decoded is null');
            res.send({ success: false, message: 'decoded is null', error: null, data: null });
            return;
        }
        console.log('decoded value:', decoded);

        if (decoded.userId) {
            const db = req.app.locals.db;
            const loginCollection = db.collection('login');
            loginCollection.deleteMany({
                email: decoded.userId
            }, function (error, result) {
                if (error) {
                    res.send({ success: false, message: 'Exception occured', error: error, data: null });
                    console.log('Exception occured');
                } else {
                    console.log('Logout succeed');
                    res.send({ success: true, message: 'Logout succeed', error: null, data: null });
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