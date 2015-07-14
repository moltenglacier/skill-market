'use strict'

skill.controller("MarketCtrl", function($scope, SkillService) {
  SkillService.getAllSkills()
  .success(function(data) {
    $scope.posts = data;
  })
  .catch(function(error) {
    console.error(error);
  })
});
