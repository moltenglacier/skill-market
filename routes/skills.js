var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var router = express.Router();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/skills');

var Skill = mongoose.model("Skill", {
  name: { type: String, required: true },
  skillTitle: { type: String, required: true },
  skillCategory: { type: String, required: true },
  tradeCategories: { type: String },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

var skillsUrl = '/skills';

Skill.on('index', function(err) {
  if (err) {
    console.error(err);
  }
});

router.get('/', function(req, res, next) {
  fs.readFile('./routes/request.html', 'utf8', function(err, data){
    if(err){
      console.log(err);
      res.status(500).json({ error: 'Something went wrong! Fix it idiot!' });
    }
    res.send(data);
  });
});

router.post(skillsUrl, function(req, res, next){
  var newSkill = new Skill(req.body);
  newSkill.save(function(err, savedSkill) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Validation Failed" });
    }
    console.log("savedSkill:", savedSkill);
    res.json(savedSkill);
  });
});

router.get(skillsUrl, function(req, res, next) {
  Skill.find().limit(20).exec(function(err, skills) {
    console.log("running");
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Could not retrieve skills" });
    }
    res.json(skills);
  });
});

router.get(skillsUrl + '/:id', function(req, res, next) {
  Skill.findOne({ _id: req.params.id }).exec(function(err, skill) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read skill data" });
    }
    if (!skill) {
      res.status(404);
    }
    res.json(skill);
  });
});

router.patch(skillsUrl + "/:id", function(req, res) {
  Skill.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true } ).exec(function(err, updatedSkill) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read skill data" });
    }
    if (!updatedSkill) {
      res.status(404);
    }
    res.json(updatedSkill);
  });
});

router.delete(skillsUrl + "/:id", function(req, res) {
  Skill.findOneAndRemove({ _id: req.params.id }).exec(function(err, skill) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read skill data" });
    }
    if (!service) {
      res.status(404);
    }
    res.json({message: 'Skill deleted'});
  });
});

module.exports = router;