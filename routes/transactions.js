var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

mongoose.createConnection(process.env.MONGOLAB_URI || 'mongodb://localhost/transactions');

var Transaction = mongoose.model("Transaction", {
  userOne: { type: String, required: true },
  userTwo: { type: String, required: true },
  skillOne: { type: String, required: true },
  skillTwo: { type: String, required: true },
  status: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

var transactionUrl = '/transactions';

router.post(transactionUrl, function(req, res, next) {
  var newTransaction = new Transaction(req.body);
  newTransaction.save(function(err, savedTransaction) {
    console.log('transaction running');
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Validation Failed" });
    }
    console.log("savedTransaction:", savedTransaction);
    res.json(savedTransaction);
  });
});

router.get(transactionUrl, function(req, res, next) {
  Transaction.find({}).exec(function(err, transactions) {
    console.log("running");
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Could not retrieve transactions" });
    }
    res.json(transactions);
  });
});

router.patch(transactionUrl + "/:id", function(req, res) {
  Transaction.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true } )
  .exec(function(err, updatedTransaction) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read skill data" });
    }
    if (!updatedTransaction) {
      res.status(404);
    }
    res.json(updatedTransaction);
  });
});

module.exports = router;