'use strict'

skill.controller("ProfileCtrl", function($scope, $state, UserService, SkillService, TransactionService) {
  var username = $state.params.id;
  UserService.getUser(username)
  .success(function(data) {
    $scope.user = data;
  })
  .catch(function(error) {
    console.error(error);
    swal("Warning!", "This user does not exist!", "error");
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
});
