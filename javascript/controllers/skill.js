'use strict'

skill.controller("SkillCtrl", function($scope, $rootScope, $state, SkillService, TransactionService) {
  var skill_id = $state.params.id;
  SkillService.getOneSkill(skill_id)
  .success(function(data) {
    $scope.skill = data;
  })
  .catch(function(error) {
    console.error(error);
  })
  SkillService.getAllSkills()
  .success(function(data) {
    $scope.skills = data;
  })
  .catch(function(error) {
    console.error(error);
  })
  $scope.offerTrade = function() {
    var skillToTrade = $scope.skills.filter(function(skill) {
      return (skill.skillTitle === $scope.selectedSkill) && (skill.name === $rootScope.currentUserData.displayName);
    })
    var transaction = {
      userOne: skillToTrade[0].name,
      userTwo: $scope.skill.name,
      skillOne: skillToTrade[0].skillTitle,
      skillTwo: $scope.skill.skillTitle,
      status: 0,
    }
    TransactionService.postTransaction(transaction)
    .success(function(data) {
      swal("Good job!", "Transaction submitted!", "success");
    })
    .catch(function(error) {
      console.error(error);
    })
    $state.go("market");
  }
});
