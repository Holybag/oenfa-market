var express = require('express');
const multer = require('multer');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
const checkAuth = require('../middleware/check-auth');

var router = express.Router();

console.log("storage");
let storage = multer.diskStorage({    
    destination: function(req, file, callback){
        console.log("dest");
        callback(null, "uploadfiles/");
    },
    filename: function(req, file, callback){
        console.log('multer.diskStorage');
        let arrSplite = file.originalname.split('.');
        let arrFirstpart = arrSplite.slice(0, arrSplite.length-1);
        let firstPart = arrFirstpart.join('');
        let newFile = firstPart + '-' + Date.now() + '.' + arrSplite[arrSplite.length-1];
        callback(null, newFile);
    }
});

//let upload = multer({ storage: storage,  limits: { fileSize: 5 * 1024 * 1024 } }).single('imgFile');
let upload = multer({ storage: storage,  limits: { fileSize: 5 * 1024 * 1024 } }).array('imgFile',10);
console.log("upload");

router.use(bodyParser.urlencoded({ extended: false }));


/* GET products listing. */
router.get('/', function (req, res, next) {
    const db = req.app.locals.db;
    //console.log(db);
    const productsCollection = db.collection('products');
    productsCollection.find({}).toArray(function (error, results) {
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

/* GET product detail Info. */
router.get('/:objId', function (req, res, next) {
    const db = req.app.locals.db;
    var objId = req.params.objId;
    var o_id = new mongo.ObjectId(objId);
    //console.log(req.params);  
    const productsCollection = db.collection('products');
    productsCollection.findOne({"_id":o_id}, function (error, results) {
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
            console.log("results:",results);
            res.send(formatted);
        }
    });
});

/* GET product list in Category. */
router.get('/category/:strCategory', function (req, res, next) {
    const db = req.app.locals.db;
    var categoryCode = Number(req.params.strCategory);
    //console.log(req.params);  
    const productsCollection = db.collection('products');
    productsCollection.find({"category":categoryCode}).toArray(function (error, results) {
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


router.post('/', checkAuth, upload, function(req, res, next){
    console.log("POST");
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
    const db = req.app.locals.db;

    let title = req.body.title;
    let userId = req.body.userId;
    let category = req.body.category;
    let price = req.body.price;
    let description = req.body.description;
    let createdAt = new Date();
//    let newFile = req.files[0].filename;
    
    let newFiles = [];
    for(i=0;i < req.files.length; i++){
        newFiles.push(req.files[i].filename);
    };
    console.log("newFiles:",newFiles);
    //console.log('title:' + title + ' userId:' + userId + ' category:' + category + ' price:' + price + ' description:' + description + ' imageFile:' + newFile);

    const productsCollection = db.collection('products');
    productsCollection.insertOne({
        title: title,
        userId: parseInt(userId),
        category: parseInt(category),
        price: parseInt(price),
        description: description,
        //image: newFile,
        images: newFiles,
        createdAt: createdAt,
    }, function(error, result){
        if (error){
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
                message: 'Product is created',
                errors: null,
                data: {
                    title: title,
                    userId: userId,
                    category: category,
                    price: price,
                    description: description,
                    //image: newFile,
                    images: newFiles,
                    createdAt: createdAt
                }
            };
            res.send(formatted);            
        }
    });
    
});

router.delete('/', function(req, res, next){
    const db = req.app.locals.db;
    const productsCollection = db.collection('products');
    productsCollection.deleteMany({}, function(error, result){
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
                message: result.deletedCount + ' products are deleted',
                errors: null,
                data: null
            };
            res.send(formatted);
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
    const db = req.app.locals.db;
    let id = req.params.id;
    console.log('id:', id);

    const productsCollection = db.collection('products');
    productsCollection.deleteOne({
        _id: new mongo.ObjectID(id)
    }, function(error, result){
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
                message: 'Product is deleted',
                errors: null,
                data: {
                    id: id
                }
            };
            res.send(formatted);
        }
    });
});

router.put('/:id', function(req, res, next){
    const db = req.app.locals.db;
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
                message: 'Product is updated',
                errors: null,
                data: {
                    id: id
                }
            };
            res.send(formatted);
        }
    });
});

module.exports = router;
