const express = require('express');
const router = express.Router();
const maria = require('../bin/maria');

/* 로그인페이지*/
router.get('/', function(req, res, next) {
    res.render('board/list');
  });
/*영상페이지*/
router.get('/movie',function(req,res,next){
    res.render('board/movie');
})
/* 어플에  최신 출입기록 15개만 보내기*/
router.get('/testname', function(req, res, next) {
  maria.query('select * from users order by id desc limit 15;', function(err, rows, fields) { 
      if(!err) { 
        res.json({rows});
         
      } else { 
        console.log("err : " + err);
        res.send(err); 
      }
    });
  });
/* 어플에서 로그인 기능*/
router.post('/testlog', function (req, res, next) {
  var id = req.body['id'];
  var password = req.body['password'];
  maria.query('select * from notice where user=\'' + id + '\' and password=\'' + password + '\'', function (err, rowq, fields) {
    if (!err) {
      if(rowq[0]!=undefined){ 
         res.json(true);
      }
      else{
        res.json(false);
      }
    }
    else {
      res.json(false);
      }
});
});
/*어플에 온습도 보내기*/
router.get('/testtemp', function(req, res, next) {
    maria.query('select * from temphum order by id desc limit 1;', function(err, rowd, fields) { 
        if(!err) { 
          res.json({rowd}); 
        } else { 
          console.log("err : " + err);
          res.send(err); 
        }
      });
    });
/* 하드웨어에서 온습도 받아오기*/
router.post('/testtemp', function(req, res, next) {
  try{  
      var body = req.body;
      maria.query('INSERT INTO temphum(temp, hum) values (?,?)',[body.temp, body.hum]), function(err, rows, fields) {      
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
/* 어플에서 회원가입 데이터 저장*/
router.post('/testuser', function(req, res, next) {
  try{
    var body = req.body;       
    maria.query('INSERT INTO notice(user, password, name) values (?,?,?)',[ body.id, body.password, body.name]), function(err, rows, fields) {
        
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
/* 하드웨어에 문열고닫는 스위치값 보내기*/
router.get('/testinout', function(req, res, next) {
    maria.query('select * from in_out;', function(err, rowf, fields) { 
        if(!err) { 
          res.json({rowf}); 
        } else { 
          console.log("err : " + err);
          res.send(err); 
        }
      });
    });
/* 어플이나 하드웨어에서 열고 닫는 스위치값 변환*/
router.put('/testinout', function(req, res, next) {
  try{
      var inouts = req.body['inouts'];
      console.log(inouts);   
      maria.query('UPDATE in_out SET inouts =\''+inouts+'\' WHERE id=\''+1+'\''), function(err, rows, fields) {    
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
/*회원가입 페이지*/
router.get('/join', function(req, res, next) {
    res.render('board/join');
});
/* 회원가입 하면 데이터베이스에 저장 */
router.post('/join', function(req, res, next) {
    try{
        var body = req.body;       
        maria.query('INSERT INTO notice(user, password, name) values (?,?,?)',[ body.id, body.password, body.name]), function(err, rows, fields) {
            
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
    res.redirect('/');
});
/* 로그인 페이지*/
router.get('/login', function(req, res, next) {
    res.render('board/login');
});
/* 로그인 하면 데이터베이스에서 확인 후 로그인*/
router.post('/login', function (req, res, next) {
    var id = req.body['id'];
    var password = req.body['password'];
    console.log(req.body);
    maria.query('select * from notice where user=\'' + id + '\' and password=\'' + password + '\'', function (err, rows, fields) {
        if (!err) {
            if (rows[0]!=undefined) {
               return res.redirect("/board");
            } else {
               res.redirect("/board/login");
            }
        } else {
          return  res.send('error : ' + err);
        }
    });
});
/* 출입기록 페이지*/
router.get('/log',function(req,res,next){
  res.render('board/log');
});
/* 원하는 출입기록 날짜 입력하면 보여주기*/
router.post('/log', function (req, res, next) {
  var year = req.body['year'];
  var month = req.body['month'];
  var day = req.body['day'];
  console.log(req.body);
  maria.query('select * from users where date1=\'' + year +'-'+ month +'-'+ day + '\'', function (err, rows, fields) {
      if (!err) {
          if (rows[0]!=undefined) {
            return res.render('board/loglist', {
              results: rows    
            });
          } else {
             res.redirect('log')
          }
      } else {
        return  res.send('error : ' + err);
      }
  });
});
router.get('/image',function(req,res,next){
  res.render('board/image');
});
router.post('/image', function (req, res, next) {
  var year = req.body['year'];
  var month = req.body['month'];
  var day = req.body['day'];
  console.log(req.body);
  maria.query('select * from img_table where date=\'' + year +'-'+ month +'-'+ day + '\'', function (err, rows, fields) {
      if (!err) {
          if (rows[0]!=undefined) {
            return res.render('board/imagedate', {
              results: rows    
            });
          } else {
             res.redirect('image')
          }
      } else {
        return  res.send('error : ' + err);
      }
  });
});
/* 온습도 페이지 가장 최신 온습도 가져오기*/
router.get('/temphum', function(req, res, next) {
  maria.query("select * from temphum order by id desc limit 1;", function(err, result, fields){
    if(err){
      console.log(err);
      console.log("쿼리문에 오류가 있습니다.");
    }
    else{
      res.render('board/temphum', {
        results: result
      });
    }
  });
});
/* 어플에서 id 보내주면 그거에 맞는 이름 어플에 보내주기*/
router.post('/testlog1', function (req, res, next) {
  var id = req.body['id'];
  console.log(id);
  maria.query('select * from notice where user=\'' + id + '\'', function (err, rowq, fields) {
    if (!err) {
      if(rowq[0]!=undefined){
        console.log(rowq[0]['name']);
        res.json(rowq[0]['name']);
      }
      else{
        res.json(false);
      }
    }
    else {
      res.json(false);
      }
});
});
/*어플에서 문 열었을 때 출입기록 데이터베이스에 쌓기*/
var check = '✓';
router.post('/testlog2', function (req, res, next) {
  try{ 
    var body = req.body;
    console.log(req.body);
    maria.query('INSERT INTO users(name,phone) values (?,?)',[body.name, check]), function(err, rows, fields) {       
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
/* 지문등록 하기위해 어플에서 이름 보내준걸 name1에 저장*/
var name1;
router.post('/testlog3', function (req, res, next) {
  var name = req.body['name'];
  console.log(req.body);
  maria.query('select * from notice where name=\'' + name +'\'', function (err, rows, fields) {
    if (!err) {
        if (rows[0]!=undefined) {
          name1 = rows;
          console.log(name1);
          res.json({rows});
        } else {
           res.json(false)
        }
    } else {
      return  res.send('error : ' + err);
    }
});
});
/* 하드웨어에 지문등록위한 이름 보내주기*/
router.get('/finger',function(req,res,next){
  res.json({name1});
});
/* 하드웨어에서 지문등록 하면 그 이름의 지문을 회원정보에 저장*/
router.post('/testfinger',function(req,res,next){
  try{ 
    var name = req.body['name'];
    var finger = req.body['finger']
    console.log(req.body);
    maria.query('update notice set finger=\'' + finger + '\' where name=\'' + name + '\''), function(err, rows, fields) {       
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
/* 지문으로 문 열을 시에 출입기록에 이름저장*/
var name2;
router.post('/testfinger1', function (req, res, next) {
  var finger = req.body['finger'];
  console.log(req.body);
  /* finger가 일치한 회원찾아서 name2에 저장*/
  maria.query('select * from notice where finger=\'' + finger + '\'', function(err, rows, fields) {
    if (!err) {
        if (rows[0]!=undefined) {
          name2 = rows[0]['name'] 
          console.log(name2);
          maria.query('INSERT INTO users(name,fingerprint) values (?,?)',[name2, check], function(err, rowf, fields) { 
        });
          res.json(true);
        } else {
           res.json(false)
        }
    } else {
      return  res.send('error : ' + err);
    }
}); /* finger가 일치한 회원을 출입기록에 저장 */
});
/* 하드웨어에 지문등록 할 이름 보내기*/
router.get('/finger1', function(req, res, next) {
  name = name1[0]['name']
  console.log(name1[0]['name']);
  maria.query('select * from notice where name = \'' + name + '\'', function(err, rowf, fields) { 
      if(!err) { 
        res.json({rowf}); 
      } else { 
        console.log("err : " + err);
        res.send(err); 
      }
    });
  });
/* 지문인식 등록 버튼 스위치*/
router.put('/testenroll', function(req, res, next) {
  try{
      var roll = req.body['roll'];
      console.log(roll);   
      maria.query('UPDATE enroll SET roll =\''+roll+'\' WHERE id=\''+1+'\''), function(err, rows, fields) {    
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
/* 지문인식 등록 스위치*/
router.get('/testenroll', function(req, res, next) {
  maria.query('select * from enroll;', function(err, rowf, fields) { 
      if(!err) { 
        res.json({rowf}); 
      } else { 
        console.log("err : " + err);
        res.send(err); 
      }
    });
  });
router.get('/testpage', function(req, res, next) {
      res.render('board/smartfarmtest');
    });
module.exports = router