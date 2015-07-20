'use strict'

skill.factory('TransactionService', function($http, BASE_URL) {
  return {
    postTransaction: function(transaction) {
      return $http.post('/api/transactions', transaction);
    },
    getAllTransactions: function() {
      return $http.get('/api/transactions');
    },
    updateTransaction: function(transaction_id, updatedTransaction) {
      return $http.patch('/api/transactions/' + transaction_id, updatedTransaction)
    }
  }
});
