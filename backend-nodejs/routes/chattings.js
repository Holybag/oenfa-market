var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const checkAuth = require('../middleware/check-auth');
var jwt = require('jsonwebtoken');

const config = process.env.NODE_ENV === "prod"
    ? require("../application.prod.json")
    : require("../application.dev.json");

const SVC_URL = config.email.SVC_URL;

router.use(bodyParser.urlencoded({ extended: false }));


/* POST chatting list */
router.post('/', checkAuth, function (req, res, next) {
    console.log("POST---");

    //console.log("req.body", req.body);

    // After check-auth.js (in middleware)
    // get userId from token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token);
    if (decoded === null) {
        console.log('decoded is null');
        res.send({ success: false, message: 'decoded is null', error: null, data: null });
        return;
    }
    let userId = decoded.userId;

    const db = req.app.locals.db;

    console.log("req.body");
    
    let roomId = req.body.roomId;
    let sellerId = req.body.sellerId;
    let message = req.body.message;
    let buyerId = userId;
    let createdAt = new Date();
    let updatedAt = new Date();


    const chattingsCollection = db.collection('chat_rooms');
    chattingsCollection.insertOne({
        roomId: roomId,
        sellerId: sellerId,
        buyerId: buyerId,
        message: message,
        createdAt: createdAt,
        updatedAt: updatedAt
    }, function (error, result) {
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
                message: 'Chatting Romm is created',
                errors: null,
                data: {
                    roomId: roomId,
                    sellerId: sellerId,
                    buyerId: buyerId,
                    //message: message,
                    createdAt: createdAt,
                    updatedAt: updatedAt
                }
            };
            res.send(formatted);
        }
    });
});


/* GET chatting My list in ViewChatting.js */
router.get('/', checkAuth, function (req, res, next) {
    //const db = req.app.locals.db;
    //var categoryCode = Number(req.params.strCategory);
    console.log("/chattings");

    // 인증이 있는 부분 미들웨어로 변경
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token);
    if (decoded === null) {
        console.log('decoded is null');
        res.send({ success: false, message: 'decoded is null', error: null, data: null });
        return;
    }
    // After check-auth.js (in middleware)
    let userId = decoded.userId;

    const db = req.app.locals.db;
    const chattingsCollection = db.collection('chat_rooms');
    //chattingsCollection.find({ $or: [{ buyerId: userId }, {sellerId: userId }]}).aggregate([{ $group : { _id : "$roomId" } } ] ).toArray(function (error, results) {
    chattingsCollection.find({ $or: [{ buyerId: userId }, {sellerId: userId }]}).toArray(function (error, results) {
    //chattingsCollection.find({ buyerId: userId }).toArray(function (error, results) {
    //chattingsCollection.find().toArray(function (error, results) {
        if (error) {
            let data = {
                success: false,
                message: null,
                errors: error,
                data: null
            };
            res.send(data);
        } else {
            //res.send(results);
            var data = {
                "success": true,
                "message": null,
                "errors": null,
                "data": results
            };
            //console.log(data);
            //console.log(data.data);
            res.send(data);
        }
    });
});

/* GET chat_msgs in ViewChatting.js */
router.get('/msgs/:id', checkAuth, function (req, res, next) {
    //const db = req.app.locals.db;
    //var categoryCode = Number(req.params.strCategory);
    console.log("/msgs/:id");
    let objId = req.params.id;
    
    // 인증이 있는 부분 미들웨어로 변경
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token);
    if (decoded === null) {
        console.log('decoded is null');
        res.send({ success: false, message: 'decoded is null', error: null, data: null });
        return;
    }
    // After check-auth.js (in middleware)
    let userId = decoded.userId;

    const db = req.app.locals.db;
    const chattingsCollection = db.collection('chat_msgs');
    chattingsCollection.find({ roomId: objId }).toArray(function (error, results) {
    //chattingsCollection.find({ $or: [{ buyerId: userId }, {sellerId: userId }]}).toArray(function (error, results) {
    //chattingsCollection.find({ buyerId: userId }).toArray(function (error, results) {
    //chattingsCollection.find().toArray(function (error, results) {
        if (error) {
            let data = {
                success: false,
                message: null,
                errors: error,
                data: null
            };
            res.send(data);
        } else {
            //res.send(results);
            var data = {
                "success": true,
                "message": null,
                "errors": null,
                "data": results
            };
            //console.log(data);
            //console.log(data.data);
            res.send(data);
        }
    });
});


module.exports = router;