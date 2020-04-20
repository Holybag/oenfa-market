var express = require('express');
const multer = require('multer');
var mongo = require('mongodb');
var bodyParser = require('body-parser');


var router = express.Router();
let storage = multer.diskStorage({    
    destination: function(req, file, callback){
        callback(null, "uploadfiles/");
    },
    filename: function(req, file, callback){
        //console.log('multer.diskStorage');
        let arrSplite = file.originalname.split('.');
        let arrFirstpart = arrSplite.slice(0, arrSplite.length-1);
        let firstPart = arrFirstpart.join('');
        let newFile = firstPart + '-' + Date.now() + '.' + arrSplite[arrSplite.length-1];
        callback(null, newFile);
    }
});

let upload = multer({ storage: storage }).single('imgFile');

router.use(bodyParser.urlencoded({ extended: false }));

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


/* GET products listing. */
router.get('/', function (req, res, next) {
    const productsCollection = db.collection('products');
    productsCollection.find({}).toArray(function (error, results) {
        if (error) {
            res.send(error);
        } else {
            res.send(results);
        }
    });
});

/* GET product detail Info. */
router.get('/:objId', function (req, res, next) {
    var objId = req.params.objId;
    var o_id = new mongo.ObjectId(objId);
    //console.log(req.params);  
    const productsCollection = db.collection('products');
    productsCollection.findOne({"_id":o_id}, function (error, results) {
        if (error) {
            res.send(error);
        } else {
            res.send(results);
        }
    });
});

/* GET product list in Category. */
router.get('/category/:firstKinds', function (req, res, next) {
    var firstKinds = req.params.firstKinds;
    //var o_id = new mongo.ObjectId(objId);
    console.log(req.params);  
    const productsCollection = db.collection('products');
    productsCollection.find({"firstKinds":firstKinds}).toArray(function (error, results) {
        if (error) {
            res.send(error);
        } else {
            res.send(results);
        }
    });
});
 

router.post('/', upload, function(req, res, next){
    //let uploadFileName;
    // (req, res, function(err){
    //     if (err){
    //         console.log('에러발생',JSON.stringify(err));
    //         res.status(400).send('fail saving image');
    //         return;
    //     }
    //     uploadFileName = res.req.file.filename;
    //     // console.log('1 res:', res);
    //     // console.log('2 res.req', res.req)
    //     // console.log('최종파일이름:',uploadFileName);
    // });
    
    let title = req.body.title;
    let userId = req.body.userId;
    let category = req.body.category;
    let price = req.body.price;
    let description = req.body.description;
    let createdAt = new Date();
    let newFile = req.file.filename;
    console.log('title:' + title + ' userId:' + userId + ' category:' + category + ' price:' + price + ' description:' + description + ' imageFile:' + newFile);

    const productsCollection = db.collection('products');
    productsCollection.insertOne({
        title: title,
        userId: parseInt(userId),
        category: parseInt(category),
        price: parseInt(price),
        description: description,
        image: newFile,
        createdAt: createdAt,
    }, function(error, result){
        if (error){
            res.send(error);
        } else {
            let result = {
                title: title,
                userId: userId,
                category: category,
                price: price,
                description: description,
                image: newFile,
                createdAt: createdAt,                
            }

            res.send(result);
        }
    });
    
});

router.delete('/', function(req, res, next){
    const productsCollection = db.collection('products');
    productsCollection.deleteMany({}, function(error, result){
        if (error) {
            res.send(error);
        } else {
            res.send(result);
        }
    });
});

/* delete result ok json msg
{
    "result": {
        "n": 10,
        "ok": 1
    },
    "connection": {
        "id": 3,
        "host": "localhost",
        "port": 27017
    },
    "deletedCount": 10,
    "n": 10,
    "ok": 1
}
*/

router.delete('/:id', function(req, res, next){
    let id = req.params.id;
    console.log('id:', id);

    const productsCollection = db.collection('products');
    productsCollection.deleteOne({
        _id: new mongo.ObjectID(id)
    }, function(error, result){
        if (error) {
            res.send(error);
        } else {
            res.send(result);
        }
    });
});

router.put('/:id', function(req, res, next){
    let id = req.params.id;
    let title = req.body.title;
    let category = req.body.category;
    let price = req.body.price;
    let description = req.body.description;

    console.log("id:" + id + ' title:' + title + ' category:' + category + ' price:' + price + ' description:' + description);

    const productsCollection = db.collection('products');
    productsCollection.updateOne({
        _id: new mongo.ObjectID(id)
    }, {
        $set: { 
            title: title, 
            category: parseInt(category),
            price: parseInt(price),
            description: description
        }
    }, 
    function(error, result){
        if (error) {
            res.send(error);
        } else {
            res.send(result);
        }
    });
});

module.exports = router;
