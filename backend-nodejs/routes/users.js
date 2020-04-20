var express = require('express');
var mongo = require('mongodb');
var bodyParser = require('body-parser');

var router = express.Router();

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


/* GET users listing. */
router.get('/', function (req, res, next) {
  const usersCollection = db.collection('users');
  usersCollection.find({}).toArray(function (error, results) {
    if (error) {
      res.send(error);
    } else {
      res.send(results);
    }
  });
});

router.get('/:id', function (req, res, next) {

  let id = req.params.id;
  console.log('id:', id);

  const usersCollection = db.collection('users');
  usersCollection.findOne({_id: new mongo.ObjectId(id)}, function (error, results) {
    if (error) {
      res.send(error);
    } else {
      res.send(results);
    }
  });
});

router.post('/', function(req, res, next){
  let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;
  let description = req.body.description;
  console.log('email:' + email + ' password:' + password + ' name:' + name + ' description:' + description);
  
  const usersCollection = db.collection('users');
  usersCollection.insertOne({
    email: email,
    password: password,
    name: name,
    description: description,
    createdAt: new Date(),
    updatedAt: new Date()
  }, function(error, result){
    if (error) {
      res.send(error);
    } else {
      res.send(result);
    }
  });

});

/* user post result
{
    "result": {
        "n": 1,
        "ok": 1
    },
    "connection": {
        "id": 0,
        "host": "localhost",
        "port": 27017
    },
    "ops": [
        {
            "email": "aaa@aaa.com",
            "password": "aaa",
            "name": "mike",
            "description": "I am Mike",
            "createdAt": "2020-04-18T18:45:35.928Z",
            "updatedAt": "2020-04-18T18:45:35.928Z",
            "_id": "5e9b4acfa189f7712054390b"
        }
    ],
    "insertedCount": 1,
    "insertedId": "5e9b4acfa189f7712054390b",
    "n": 1,
    "ok": 1
}
*/


router.delete('/', function(req, res, next){
  const usersCollection = db.collection('users');

  usersCollection.deleteMany({}, function(error, result){
    if (error) {
      res.send(error);
    } else {
      res.send(result);
    }
  })
});

/* delete many result
{
    "result": {
        "n": 2,
        "ok": 1
    },
    "connection": {
        "id": 0,
        "host": "localhost",
        "port": 27017
    },
    "deletedCount": 2,
    "n": 2,
    "ok": 1
}
*/

router.delete('/:id', function(req, res, next){
  let id = req.params.id;
  console.log('id:', id);

  const usersCollection = db.collection('users');

  usersCollection.deleteOne({_id: new mongo.ObjectId(id)}, function(error, result){
    if (error) {
      res.send(error);
    } else {
      res.send(result);
    }
  });
});

/* delete one result
{
  "result": {
      "n": 1,
      "ok": 1
  },
  "connection": {
      "id": 0,
      "host": "localhost",
      "port": 27017
  },
  "deletedCount": 1,
  "n": 1,
  "ok": 1
}
*/

router.put('/:id', function(req, res, next){
  let id = req.params.id;
  //let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;
  let description = req.body.description;
  console.log('id:' + id + ' password:' + password + ' name:' + name + ' description:' + description);

  const usersCollection = db.collection('users');
  usersCollection.updateOne({
    _id: new mongo.ObjectId(id)
  }, {
    $set: {
      password: password,
      name: name,
      description: description
    }
  }, function(error, result){
    if (error) {
      res.send(error);
    } else {
      res.send(result);
    }
  });
});

/* put result
{
    "result": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    },
    "connection": {
        "id": 0,
        "host": "localhost",
        "port": 27017
    },
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1,
    "n": 1,
    "nModified": 1,
    "ok": 1
}
*/

module.exports = router;
