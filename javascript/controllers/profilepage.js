'use strict'

skill..controller("ProfilepageCtrl", function($scope, $rootScope, $state, UserService, SkillService, TransactionService) {
  UserService.getUser($rootScope.currentUserData.displayName)
  .success(function(data) {})
  .catch(function(error) {
    swal("Warning", "You are not logged in!", "error");
    $state.go("market");
  })
  SkillService.getAllSkills()
  .success(function(data) {
    $scope.skills = data;
  })
  .catch(function(error) {
    console.error(error);
  })
  TransactionService.getAllTransactions()
  .success(function(data) {
    $scope.transactions = data;
  })
  .catch(function(error) {
    console.error(error);
  })
  $scope.deletePost = function(skillID) {
    SkillService.deleteSkill(skillID)
    .success(function(data) {
      swal("Good job!", "Successfully deleted skill!", "success");
    })
    .catch(function(error) {
      console.error("Did not delete skill!");
    })
  }
  $scope.editPost = function(index) {
    $scope.editIndex = index;
  }
  $scope.submitPost = function(skillId, update) {
    SkillService.editSkill(skillId, update)
    .success(function(data) {
      swal("Good job!", "Successfully updated skill!", "success");
    })
    .catch(function(error) {
      console.log(error);
    })
    $scope.editIndex = false;
  }
  $scope.acceptTransaction = function(deal) {
    var transaction_id = deal._id;
    deal.status = 1;
    var updatedTransaction = deal;
    TransactionService.updateTransaction(transaction_id, updatedTransaction)
    .success(function(data) {
      swal("Good job!", "Successfully accepted transaction!", "success");
    })
    .catch(function(error) {
      console.error(error);
    })
  }
  $scope.rejectTransaction = function(deal) {
    var transaction_id = deal._id;
    deal.status = -1;
    var updatedTransaction = deal;
    TransactionService.updateTransaction(transaction_id, updatedTransaction)
    .success(function(data) {
      swal("Good job!", "Successfully rejected transaction!", "error");
    })
    .catch(function(error) {
      console.error(error);
    })
  }
});
