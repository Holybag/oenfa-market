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
    let price = req.body.price;
    let description = req.body.description;
    let createdAt = new Date();
    let newFile = req.file.filename;
    console.log(newFile);

    const productsCollection = db.collection('products');
    productsCollection.save({
        title: title,
        userId: parseInt(userId),
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
                price: price,
                description: description,
                image: newFile,
                createdAt: createdAt,                
            }

            res.send(result);
        }
    });
    
});

module.exports = router;
