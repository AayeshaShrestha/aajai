var express = require('express');
var router = express.Router();
var Subjects = require('../models/subjects');
var Chapters = require('../models/chapters');
var Users = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/main', function(req, res, next) {
  res.render('main');
});


router.get('/todo/:id', function(req, res, next) {
  Users.findOne({ _id : req.params.id}).exec(function(err, user){
    res.render('todo',{user});
  });
});

router.post('/todo',function(req,res){

});

router.get('/addSubject',function(req,res){
  res.render('addSubject');
});

router.get('/signup', function(req, res){
	res.render('signup');
});

router.post('/signup', function (req, res) {
	console.log('req confirmed', req.body);
});

router.get('/profile', function(req, res) {
	res.render('/profile');
});

router.post('/addSubject', function(req, res){
  //res.send(req.body);
  var subject = new Subjects({
    subjectName : req.body.subName,
    subjectCode : req.body.subCode,
    sem : req.body.sem,
    faculty : req.body.faculty,
    numOfChapters : req.body.numOfChapters
  });

  var promise = subject.save();
  promise.then((subject) => {
    //console.log('saved subject is',subject);
    res.render('addChapters',{subject});
  }).catch((error) => {
    console.log(error);
  });
});

router.post('/addChapters',function(req, res){
  //res.send(req.body);
  for (var i = 0; i < (req.body.chapterName).length; i++) {
    var chapter = new Chapters({
      chapterName : req.body.chapterName[i],
      subjectCode : req.body.subjectCode[i],
      hours : req.body.hours[i],
      marks : req.body.marks[i],
      sem : req.body.sem[i],
      faculty : req.body.faculty[i]
    });

    var promise = chapter.save();
    promise.then((chapter) => {
      console.log(chapter);
    });
  }
  res.redirect('/adminView');
});

router.get('/adminView',function(req,res){
  Subjects.find().exec(function(err, subjects){
    res.render('adminView',{subjects});
  });
});

router.get('/viewChapters/:subCode',function(req,res){
  Chapters.find({ subjectCode : req.params.subCode }).exec(function(err, chapters){
    //res.send(chapters);
    res.render('viewChapters',{chapters, subjectCode : req.params.subCode});
  })
});

router.get('/editSubject/:subCode', function(req,res){
  //res.send(req.params.subCode);
  Chapters.find({ subjectCode : req.params.subCode}).exec(function(err,chapters){
    res.render('editSubject',{chapters});
  });
})

router.post('/saveEdited', function(req, res){
  //res.send(req.body);
  console.log('req.body....', req.body);
  for(var i=0; i<req.body.num; i++){
    Chapters.findOneAndUpdate({ _id : req.body._id[i] }, { $set : {hours: req.body.hours[i], marks: req.body.marks[i], chapterName: req.body.chapterName[i]} }, (err, chapter) => {
      if(!err){
        console.log("hello");
      }else{
        console.log("Error!!",err);
      }
    });
  }
});

router.post('/setProfile',function(req, res){
  Users.findOneAndUpdate({ _id : req.body._id }, { $set : {sem: req.body.sem, faculty: req.body.faculty} },
     (err, user) => {
       console.log("jd iad");
  });

  Subjects.find({ sem : req.body.sem, faculty : req.body.faculty}, (err, Usubjects) => {
    Users.findOneAndUpdate({ _id : req.body._id}, {$set : {subjects : Usubjects} },
    (err, user) => {
      console.log("subjects added");
    });
  });

  Chapters.find({ sem : req.body.sem, faculty : req.body.faculty}, (err, Uchapters) => {
    Users.findOneAndUpdate({ _id : req.body._id}, {$set : {chapters : Uchapters} },
    (err, user) => {
      res.render('examPrep',{user});
    });
  });

});

router.post('/login',function(req,res){
  if(req.body.username && req.body.password){
   Users.findOne({username : req.body.username, password : req.body.password}, function(err, user){
     if(user != null){
       //console.log('Logged in with ', user);
       if(req.body.username == "adminadmin" && req.body.password == "admin123"){
         res.redirect('/adminView');
       }
       else{
         res.render('examPrep',{user});
        }
     }else{
       console.log('User not valid');
     }
   });
 }else{
   console.log("Please enter username and password");
 }

});

router.post('/createUser', function(req, res, next){
  //res.send(req.body);
  var user = new Users({
    username : req.body.username,
    password : req.body.password,
  });

  if(req.body.username != '' && req.body.password != '' && req.body.repassword != '') {
      if(req.body.password == req.body.repassword){
          Users.findOne({ username : req.body.username}, function(err, userCheck){
            if(userCheck == null){
              var promise = user.save();
              promise.then((user) => {
                console.log('user signed with values', user);
                res.render('bio',{user});
              });
            }else{
              console.log("Username already exists.");
            }
          });
      }
      else{
      console.log("passwords donot match");
      }
  }else{
    console.log("Please fill all the fields");
  }
});

router.get('/signup',function(req,res){
  res.render('signup');
});

router.post('/setPercentage',function(req,res){

  console.log(req.body);
  // Users.findOneAndUpdate({ _id : req.body._id}, {$set : {subjects : Usubjects} },
  //   (err, user) => {
  //     console.log("subjects added");
  //   });
  
});



module.exports = router;
