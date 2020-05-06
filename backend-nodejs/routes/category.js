var express = require('express');
var mongo = require('mongodb');
var bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));


// ///// mongodb //////
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

/* GET category listing. */
router.get('/', function (req, res, next) {
    const db = req.app.locals.db;
    const categoryCollection = db.collection('category');
    // Sorting
    categoryCollection.find({}).sort({"sortNo":1}).toArray(function (error, results) {
        if (error) {
            res.send(error);
        } else {
            res.send(results);
        }
    });
});

/* GET category code to name. */
router.get('/:code', function (req, res, next) {
    var code = Number(req.params.code);
    //console.log(req.params);  
    const db = req.app.locals.db;
    const categoryCollection = db.collection('category');
    categoryCollection.findOne({"code":code}, function (error, results) {
        if (error) {
            res.send(error);
        } else {
            res.send(results);
        }
    });
});

/* Insert category data */
router.post('/', function (req, res, next) {
    let strCode = req.body.code;
    let strName = req.body.name;
    let strSortNo = req.body.sortNo;
    //console.log('code:' + strCode + ' name:' + strName + ' sortNo:' + strSortNo);
    const db = req.app.locals.db;
    const categoryCollection = db.collection('category');
    categoryCollection.insertOne({
        code: strCode,
        name: strName,
        sortNo: strSortNo,
        createdAt: new Date(),
        updatedAt: new Date()
    }, function (error, result) {
        if (error) {
            res.send(error);
        } else {
            res.send(result);
        }
    });

});


/* Delete category data */
router.delete('/:code', function (req, res, next) {
    let code = Number(req.params.code);
    //console.log('code:', code);
    const db = req.app.locals.db;
    const categoryCollection = db.collection('category');
    categoryCollection.deleteOne({"code": code }, function (error, result) {
        if (error) {
            res.send(error);
        } else {
            res.send(result);
        }
    });
});

/* Update category data */
router.put('/:code', function (req, res, next) {
    let code = Number(req.params.code);
    let name = req.body.name;
    let sortNo = req.body.sortNo;
    console.log('code:' + code + 'name:' + name + 'sortNo:' + sortNo);

    const db = req.app.locals.db;
    const categoryCollection = db.collection('category');
    categoryCollection.updateOne({
        code: code
    }, {
        $set: {
            name: name,
            sortNo: sortNo
        }
    }, function (error, result) {
        if (error) {
            res.send(error);
        } else {
            res.send(result);
        }
    });
});

  
module.exports = router;
