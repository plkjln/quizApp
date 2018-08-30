var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST to Add New Question Service */
router.post('/addQuestion', function(req, res) {
  // Set our internal DB variable
  var db = req.db;

  // Get our form values. 
  var question = req.body.question;
  var optionA = req.body.optionA;
  var optionB = req.body.optionB;
  var optionC = req.body.optionC;
  var optionD = req.body.optionD;

  // Set our collection
  var collection = db.get('questions');

  // Submit to the DB
  collection.insert({
      "question" : question,
      "optionA" : optionA,
      "optionB" : optionB,
      "optionC" : optionC,
      "optionD" : optionD
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("questionlist");
      }
  });
});

module.exports = router;
