var express = require('express');
const multer = require('multer');

var router = express.Router();

let storage = multer.diskStorage({
  destination: function(req, file, callback){
    callback(null, "files/");
  },
  filename: function(req, file, callback){
    let arrSplitName = file.originalname.split('.');
    let arrPreName = arrSplitName.slice(0, arrSplitName.length-1);
    let preName = arrPreName.join('');
    let newName = preName + '-' + Date.now().toString() + '.' + arrSplitName[arrSplitName.length-1];
    callback(null, newName);
  }
});

let upload = multer({
  storage: storage
});

/* GET home page. */
router.get('/', function(req, res, next) {  
  res.render('board');
});

router.post('/create', upload.single('imgFile'), function(req, res, next){
  let file = req.file;

  let result = {
    originalName: file.originalname,
    size: file.size,
  }

  res.json(result);
});

module.exports = router;
