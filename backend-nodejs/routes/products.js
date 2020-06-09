var express = require('express');
const multer = require('multer');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
const checkAuth = require('../middleware/check-auth');
var jwt = require('jsonwebtoken');

var router = express.Router();

const config = process.env.NODE_ENV === "prod"
  ? require("../application.prod.json")
  : require("../application.dev.json");
var tokenKey = config.auth.tokenKey;


//console.log("storage");
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
//console.log("upload");

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
    productsCollection.findOne({"_id":o_id}, function (error, result) {
        if (error) {
            let formatted = {
                success: false,
                message: null,
                errors: error,
                data: null
            };
            res.send(formatted);
        } else {
            // increase view counting
            console.log('view goods counting:', result.viewCount);
            if (result.viewCount >= 0) {
                let newCount = result.viewCount + 1;
                productsCollection.updateOne({
                    _id: o_id
                }, {
                    $set: { 
                        viewCount: newCount
                    }
                }, 
                function(error, result){
                    if (error) {
                        console.log('viewCount error:', error)
                    } else {
                        console.log('viewCount increased:', newCount);
                    }
                });
            }
                        
            let formatted = {
                success: true,
                message: null,
                errors: null,
                data: result
            };
            //console.log("result:",result);
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

/* GET product My list in MyListGoods.js */
router.get('/mylist/mylist', checkAuth, function (req, res, next) {
    //const db = req.app.locals.db;
    //var categoryCode = Number(req.params.strCategory);
    console.log("mylist/mylist");  

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
    const productsCollection = db.collection('products');
    productsCollection.find({userId: userId }).toArray(function (error, results) {
    //productsCollection.find().toArray(function (error, results) {
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


router.post('/', checkAuth, function(req, res, next){
    console.log("POST");

    console.log("req.body", req.body);
    console.log("req.body.title:", req.body.title);
    //console.log('title:' + title + ' userId:' + userId + ' category:' + category + ' price:' + price + ' description:' + description + ' imageFile:' + newFile);

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

    upload(req, res, function (err) {
        if (err) {
            // 업로드할때 오류가 발생함
            console.log("업로드 오류");
            let formatted = {
                success: false,
                message: err.message,
                errors: err,
                data: null
            };
            res.send(formatted);
            //return
        } else {
            console.log("정상 실행");
            // 정상적으로 완료됨
            const db = req.app.locals.db;

            console.log("req.body", req.body);
            console.log("req.body.title", req.body.title);
        
            
            let title = req.body.title;
            
            //let userId = req.body.userId;
            //let userId = userId;
            let category = req.body.category;
            let price = req.body.price;
            let description = req.body.description;
            let createdAt = new Date();
            let updatedAt = new Date();

            let newFiles = [];
            for (i = 0; i < req.files.length; i++) {
                newFiles.push(req.files[i].filename);
            };
            console.log("newFiles:", newFiles);
            //console.log('title:' + title + ' userId:' + userId + ' category:' + category + ' price:' + price + ' description:' + description + ' imageFile:' + newFile);

            const productsCollection = db.collection('products');
            productsCollection.insertOne({
                title: title,
                //userId: parseInt(userId),
                userId: userId,
                category: parseInt(category),
                price: parseInt(price),
                description: description,
                //image: newFile,
                images: newFiles,
                viewCount: 0,
                favoriteUsers: [],
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
        }
    });
});
    
    

router.delete('/', checkAuth, function(req, res, next){
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


/* DELETE in MyListGoods */
router.delete('/:id', checkAuth, function(req, res, next){
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

/* updGoods */
//router.put('/:id', checkAuth, function(req, res, next){
router.post('/:id', checkAuth, function(req, res, next){
//router.post('/update/', function(req, res, next){
    console.log("router.post-/update/--");

    
    upload(req, res, function (err) {
        if (err) {
            // 업로드할때 오류가 발생함
            console.log("업로드 오류");
            let formatted = {
                success: false,
                message: err.message,
                errors: err,
                data: null
            };
            res.send(formatted);
            //return
        } else {
            console.log("정상 실행");
            // 정상적으로 완료됨
            const db = req.app.locals.db;
            
            let id = req.params.id;
            //console.log("req.params.id",req.params.id);
            //console.log("req.params",req.params);
            
            let title = req.body.title;
            let userId = req.body.userId;
            let category = req.body.category;
            let price = req.body.price;
            let description = req.body.description;
            let updatedAt = new Date();

            let prevImageFiles = req.body.prevImageFiles;
            //console.log("isArray ?: ",Array.isArray(prevImageFiles));

            
            let newFiles = [];
            if (Array.isArray(prevImageFiles)){
                for (let i = 0; i < prevImageFiles.length; i++) {
                    newFiles.push(prevImageFiles[i]);
                }
            } else {
                console.log("prevImageFiles", prevImageFiles);
                if (prevImageFiles !== undefined && prevImageFiles !== null ){
                    console.log("No undefined or null");
                    newFiles.push(prevImageFiles);
                }
            }            
            for (i = 0; i < req.files.length; i++) {
                newFiles.push(req.files[i].filename);
            };

            const productsCollection = db.collection('products');
            productsCollection.updateOne({
                _id: new mongo.ObjectID(id)
            }, {
                $set: { 
                    title: title, 
                    category: parseInt(category),
                    price: parseInt(price),
                    images: newFiles,
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
        }
    });

});
    

router.put('/favorite/:id', function(req, res, next){
    const db = req.app.locals.db;
    let objId = req.params.id;
    let userId = req.body.userId;

    if (!userId) {
        let formatted = {
            success: false,
            message: 'userId is mandatory in body field',
            errors: null,
            data: null
        };
        res.send(formatted);
    }
    console.log("params - id:" + objId + ' userId:' + userId);

    var o_id = new mongo.ObjectId(objId);
    const productsCollection = db.collection('products');
    productsCollection.findOne({"_id":o_id}, function (error, result) {
        if (error) {
            let formatted = {
                success: false,
                message: null,
                errors: error,
                data: null
            };
            res.send(formatted);
        } else {
            let favoriteUsers = result.favoriteUsers;
            if (!favoriteUsers.includes(userId)) {
                favoriteUsers.push(userId);
                console.log('favoriteUsers added:', favoriteUsers);
            } else {
                favoriteUsers = favoriteUsers.filter(function(value, index, arr){
                    return value != userId;
                })
                console.log('favoriteUsers removed:', favoriteUsers);
            }
            
            productsCollection.updateOne({
                _id: o_id
            }, {
                $set: { 
                    favoriteUsers: favoriteUsers
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
                        message: 'favoriteUsers is updated',
                        errors: null,
                        data: favoriteUsers
                    };
                    res.send(formatted);
                }
            });
        }
    });

    
});

module.exports = router;
