var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var User = mongoose.model("User", {
  id: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  skills: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
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
    User.findOneAndUpdate({email: req.user.emails }, entry ,{upsert: true, new: true}, function(err, savedEntry){
      if (err) {
        console.log(err);
        res.send("fuck u")
      }
      console.log("success savedEntry", savedEntry);
    });
  }
  res.render('index');
});

module.exports = router;
