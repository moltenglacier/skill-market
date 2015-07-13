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

router.get('/users/:id', function(req, res) {
  User.findOne({ displayName: req.params.id }).exec(function(err, user) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read user data" });
    }
    if (!user) {
      res.status(404);
    }
    res.json(user);
  });
})

// router.get('/users/:id/skills', function(req, res) {
//   console.log(req.user);
//   User.findOne({ displayName: req.params.id }).exec(function(err, skills) {
//     if (err) {
//       console.log(err);
//       res.status(400).json({ error: "Could not find user's skills"});
//     }
//     res.json(skills);
//   })
// })

// router.post('/users/:id/skills', function(req, res) {
//   console.log(req.user);x
//   User.findOne({ displayName: req.params.id }).save().exec(function(err, savedSkill) {
//     if (err) {
//       console.log(err);
//       res.status(400).json({ error: "Could not save user's skill"});
//     }
//     res.json(savedSkill);
//   })
// })

router.get('/currentuser', function(req, res) {
  console.log(req.user);
  res.json(req.user);
})

module.exports = router;
