var express = require('express');
var mongo = require('mongodb');
var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');
//var tokenKey = 'oenfa2020';

var router = express.Router();

const nodemailer = require('nodemailer');

//const SVC_URL = 'http://localhost:3000'

const config = process.env.NODE_ENV === "prod"
  ? require("../application.prod.json")
  : require("../application.dev.json");

const SVC_URL = config.email.SVC_URL;
var tokenKey = config.auth.tokenKey;

const emailAdmin = config.email.emailAdmin;
const emailPass = config.email.emailPass; 
const emailSender = config.email.emailSender; 

console.log("Mail Confirm SVC_URL",SVC_URL);
//console.log("emailAdmin",emailAdmin);
//console.log("emailPass",emailPass);
//console.log("emailSender",emailSender);

router.use(bodyParser.urlencoded({ extended: false }));

/* GET users listing. */
router.get('/', function (req, res, next) {
  const db = req.app.locals.db;
  const usersCollection = db.collection('users');
  usersCollection.find({}).toArray(function (error, results) {
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


router.get('/view/', function (req, res, next) {

  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token);

  if (decoded === null) {
    console.log('decoded is null');
    res.send({ success: false, message: 'decoded is null', error: null, data: null });
    return;
  }
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
      // success
      let userId = decoded.userId;
      //console.log('email:', decoded);
      const db = req.app.locals.db;
      const usersCollection = db.collection('users');
      //usersCollection.findOne({ email: userId }, function (error, results) {
      usersCollection.findOne({ repId: userId }, function (error, results) {
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
          res.send(data);
        }
      });
    }
  });
});

/* ID Duplicate Check */
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  //console.log('id:', id);
  const db = req.app.locals.db;
  const usersCollection = db.collection('users');
  usersCollection.findOne({repId: id}, function (error, result) {
    if (error || result === null) {
      //console.log(error);
      //console.log(result);
      var data = { "success": false, "message": "존재하지 않는 이메일", "errors": error, "data": null };
      res.send(data);
    } else {
      var data = { "success": true, "message": "존재하는 이메일", "errors": null, "data": null };
      res.send(data);
    }
  });
});

/* Sign In Google Reg */
router.post('/google/', function (req, res, next) {
  const classify = "google";    // google, facebook, email
  let email = req.body.email;
  let googleId = req.body.googleId;
  let name = req.body.name;
  let familyName = req.body.familyName;
  let givenName = req.body.givenName;
  let imgeUrl = req.body.imgeUrl;

  const crypto = require('crypto');
  const authkey = crypto.randomBytes(20).toString('hex'); // token 생성
  console.log("authkey", authkey);

  console.log('classify:' + classify + ' email:' + email + ' googleId:' + googleId + ' name:' + name + ' familyName:' + familyName);
  console.log('givenName:' + givenName + ' imgeUrl:' + imgeUrl);

  if (email === null || email === "" || googleId === "") {
    console.log("Input required");
    var data = { "success": false, "message": "Fields are required.!", "errors": null, "data": null };
    res.send(data);
  }

  const db = req.app.locals.db;
  const usersCollection = db.collection('users');
  usersCollection.insertOne({
    classify: classify,
    email: email,
    googleId: googleId,
    name: name,
    familyName: familyName,
    givenName: givenName,
    imgeUrl: imgeUrl,
    authkey: authkey,           // 인증을 위한 임시 인증 키
    authttl: 300,               // 인증 제한 시간   (개발 필요)      
    authstatus: 0,              // 0: 인증전, 1: 인증 후
    createdAt: new Date(),
    updatedAt: new Date()
  }, function (error, result) {
    console.log("error", error);
    console.log("result",result);
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
        "data": result
      };
      res.send(data);
    }
  });

});

/* Sign In Email */
router.post('/', function (req, res, next) {
  const classify = 'email';
  let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;
  let tel = req.body.tel;
  let description = req.body.description;

  const crypto = require('crypto');
  const authkey = crypto.randomBytes(20).toString('hex'); // token 생성
  console.log("authkey", authkey);

  console.log('email:' + email + ' password:' + password + ' name:' + name + ' tel:' + tel + ' description:' + description);

  if (email === null || email === "" || password === "") {
    console.log("Input required");
    var data = { "success": false, "message": "Fields are required.!", "errors": null, "data": null };
    res.send(data);
  }


  const db = req.app.locals.db;
  const usersCollection = db.collection('users');
  usersCollection.insertOne({
    classify: classify,
    repId: email,
    email: email,
    password: password,
    authkey: authkey,           // 인증을 위한 임시 인증 키
    authttl: 300,               // 인증 제한 시간   (개발 필요)      
    authstatus: 0,              // 0: 인증전, 1: 인증 후
    name: name,
    tel: tel,
    description: description,
    createdAt: new Date(),
    updatedAt: new Date()
  }, function (error, result) {
    //console.log("error", error);
    //console.log("result",result);
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
        "data": result
      };

      // nodemailer Transport 생성
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        //              port: 465,
        secure: true, // true for 465, false for other ports
        auth: { // 이메일을 보낼 계정 데이터 입력
          //user: 'jshyun.de@gmail.com',
          //pass: '',
          user: emailAdmin,
          pass: emailPass,
        },
      });
      const emailOptions = { // 옵션값 설정
        from: emailSender,
        to: email,
        subject: '정상 사용자 인증 이메일입니다.',
        html: '본인 확인을 위하여 아래의 URL을 클릭하여 주세요.'
          + `${SVC_URL}/SignUpConfirm/${authkey}`,
      };
      console.log("emailOptions",emailOptions);
      /* 상용 적용시 오픈 필요 */
      //transporter.sendMail(emailOptions, res); //전송

      res.send(data);
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


/* Normal user authentication (email confirmation) */
router.get('/confirm/:authkey', function (req, res, next) {
  let authkey = req.params.authkey;
  console.log('confirm authkey:', authkey);
  let data = { "success": true, "message": null, "errors": null, "data": null };
  
  //맞는 키 조회 하고 그 키에 해당하는 사용 여부 필드 업데이트.
  const db = req.app.locals.db;
  const usersCollection = db.collection('users');
  usersCollection.updateOne({
    authkey: authkey
  }, {
    $set: {
      authkey: '',
      authstatus: 1,  // 사용 가능 1
      authttl: 0
    }
  }, function(error, result){
    console.log("업데이트 결과");
    console.log("result.result.nModified",result.result.nModified);
    let countUpdated = result.result.nModified;
    if (error || countUpdated === 0) {
      var data = { "success": false, "message": null, "errors": error, "data": result };   
      res.send(data);
      //res.send("인증 데이타를 찾을 수 없습니다!")

    } else {
      var data = { "success": true, "message": null, "errors": null, "data": result };
      res.send(data);
    }
  });

});


router.delete('/', function(req, res, next){
  const db = req.app.locals.db;
  const usersCollection = db.collection('users');

  usersCollection.deleteMany({}, function(error, result){
    if (error) {
      var data = { "success": false, "message": null, "errors": error, "data": null };   
      res.send(data);
    } else {
      var data = { "success": true, "message": null, "errors": null, "data": result };   
      res.send(data);
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

  const db = req.app.locals.db;
  const usersCollection = db.collection('users');

  usersCollection.deleteOne({_id: new mongo.ObjectId(id)}, function(error, result){
    if (error) {
      var data = { "success": false, "message": null, "errors": error, "data": null };   
      res.send(data);
    } else {
      var data = { "success": true, "message": null, "errors": null, "data": result };   
      res.send(data);
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

  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token);

  if (decoded === null) {
    //console.log('decoded is null');
    res.send({ "success": false, "message": 'decoded is null', "error": null, "data": null });
    return;
  }

  jwt.verify(token, tokenKey, function (error, decoded) {
    if (error) {
      var data = { "success": false, "message": null, "errors": error, "data": null };
      res.send(data);
    } else {
      // success
      let id = decoded.userId;
      let password = req.body.password;
      let name = req.body.name;
      let tel = req.body.tel;
      let description = req.body.description;
      //console.log('id:' + id + ' password:' + password + ' name:' + name + ' description:' + description);
  
      const db = req.app.locals.db;
      const usersCollection = db.collection('users');
      usersCollection.updateOne({
        email: id
      }, {
        $set: {
          password: password,
          name: name,
          tel: tel,
          description: description
        }
      }, function(error, result){
        if (error) {
          var data = { "success": false, "message": null, "errors": error, "data": null };   
          res.send(data);
          
        } else {
          var data = { "success": true, "message": null, "errors": null, "data": result };
          res.send(data);
        }
      });
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
