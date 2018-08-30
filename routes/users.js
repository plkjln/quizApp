var express = require('express');
var router = express.Router();

/* GET questions. */
router.get('/questions', function(req, res) {
  var db = req.db;
  var collection = db.get('questions');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});


/* POST to addQuestion. Adding NEW Question*/
router.post('/addQuestion', function(req, res) {
  var db = req.db;
  var collection = db.get('questions');
  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});




 /* GET questions page. */
/* extracting the "db" object passed to http request, 
and then using that db connection to fill "docs" with user data*/
/*
router.get('/questions', function(req, res) {
  var db = req.db;
  var collection = db.get('questions');
  collection.find({},{},function(e,docs){
      res.render('questions', {
          "questions" : docs
      });
  });
});
*/
/* GET New Questions page. */
/*
router.get('/newquestion', function(req, res) {
  res.render('newquestion', { title: 'Add New Question' });
});
*/
/* POST to Add questions Service */
/*
router.post('/addQuestion', function(req, res) {
  // Set our internal DB variable
  var db = req.db;
  // Get our form values. These rely on the "name" attributes
  var newQuestion = req.body.newQuestion;
  var optionA = req.body.optionA;
  var optionB = req.body.optionB;
  var optionC = req.body.optionC;
  var optionD = req.body.optionA;
  var correct = req.body.correct;
  // Set our collection
  var collection = db.get('myQuiz');

  // Submit to the DB
  collection.insert({
      "question" : newQuestion,
      "optionA" : optionA,
      "optionB" : optionB,
      "optionC" : optionC,
      "optionD" : optionD,
      "correct" : correct
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("testQuestion");
      }
  });
});
*/

module.exports = router;
