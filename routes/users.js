const express = require('express');
const router = express.Router();
const multer = require('multer');
const maria = require('../bin/maria');
/* 하드웨어에서 파일 보내면 uploads 폴더에 저장*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) 
  }
});
const upload = multer({ storage: storage });
var  glob  = require ('glob');
var getDirectories = function (src, callback) {
  glob(src + '/**/*', callback);
};

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/upload', function(req, res, next) {
  res.render("board/test")
});

/* 파일 업로드만 하기
router.post('/upload', upload.single('imgFile'), function(req, res){
  res.send('Uploaded! : '+req.file); 
  console.log(req.file); 
});*/
/*하드웨어에서 사진을 보내주면 데이터베이스에 이름과 경로 저장*/
router.post('/upload', upload.single('imgFile'), function(req, res){
  try{  
    var file =req.file['path'];
    var name = req.file['filename']
    console.log(req.file);
    console.log(name);
    console.log(file);
    maria.query('insert into img_table(filename,path) values (?,?)',[name, file]), function(err, rows, fields) {      
        if(!err) {        
            res.json(true);        
        } else {
            console.log(err);
            res.json(false);
        }      
    };
} catch (e) {
    console.log(e);
    res.json(false);
}
res.json(true);
});
/* 어플에 내 ip주소와 사진 저장된 경로 보내기*/
router.get('/testimage', function(req, res, next) {
  maria.query('select * from img_table;', function(err, rowf, fields) { 
      if(!err) { 
        for(var i =0; i<rowf.length; i++){
          rowf[i]['path'] = 'http://192.168.137.215:3000/'+ rowf[i]['path'];
        }
        res.json(rowf);

      } else { 
        console.log("err : " + err);
        res.send(err); 
      }
    });
  });
  /*어플에서 원하는 날짜 받아오면 그 날짜에 저장된 사진만 어플에 보내주기*/
  router.post('/testdate', function (req, res, next) {
    var date = req.body['date'];
    console.log(req.body);
    maria.query('select * from img_table where date=\'' + date + '\'', function (err, rows, fields) {
        if (!err) {
            if (rows[0]!=undefined) {
              for(var i =0; i<rows.length; i++){
                rows[i]['path'] = 'http://192.168.137.215:3000/'+ rows[i]['path'];
              }
              res.json(rows);
              console.log(rows);
            } else {
               res.json(false);
            }
        } else {
          return  res.send('error : ' + err);
        }
    });
});
/* 하드웨어에 사진 이름 때문에 id값을 보내주기*/
router.get('/i', function(req, res, next) {
  maria.query('select * from img_table order by id desc limit 1;', function(err, rowd, fields) { 
      if(!err) { 
        res.json({rowd}); 
      } else { 
        console.log("err : " + err);
        res.send(err); 
      }
    });
  });
module.exports = router;
