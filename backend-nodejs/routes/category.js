var express = require('express');
var mongo = require('mongodb');
var bodyParser = require('body-parser');

var router = express.Router();

///// mongodb //////
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

/* GET category listing. */
router.get('/', function (req, res, next) {
    const productsCollection = db.collection('category');
    productsCollection.find({}).toArray(function (error, results) {
        if (error) {
            res.send(error);
        } else {
            res.send(results);
        }
    });
});

module.exports = router;
