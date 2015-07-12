var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var User = mongoose.model("User", {
  id: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true, dropDups: true } },
  skills: [{ type: String }]
});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  if (req.user){
    var entry = new User({
      id: req.user.id,
      displayName: req.user.displayName,
      email: req.user.emails[0].value
    });
    User.findOneAndUpdate({email: req.user.emails }, entry ,{upsert: true, new: true}, 
    function(err, savedEntry){
      if (err) {
        console.log(err);
      }
      console.log("success savedEntry", savedEntry);
    });
  }
  res.render('index', { thisUserData: req.user });
});

router.get('/users', function(req, res) {
  console.log(req.user);
  User.find({}).exec(function(err, users) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Could not retrieve users" });
    }
    res.json(users);
  })
});

module.exports = router;
