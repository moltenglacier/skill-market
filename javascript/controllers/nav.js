'use strict'

skill.controller("NavCtrl", function($scope, $state, $rootScope, SkillService, UserService) {
  UserService.getCurrentUser()
  .success(function(data) {
    $rootScope.currentUserData = data;
    $rootScope.currentUserData.loggedIn = true;
  })
  .catch(function(error) {
    console.error(error);
    $rootScope.currentUserData.loggedIn = false;
  })
  $scope.postSkill = function() {
    $scope.skill.name = $rootScope.currentUserData.displayName;
    SkillService.postSkill($scope.skill)
    .success(function(data) {
      swal("Good job!", "This post was successfully proccessed!", "success");
    })
    .catch(function(error) {
      console.error(error);
    })
  }
  $scope.logout = function() {
    UserService.logoutCurrentUser();
    swal("You have been logged out!", "", "error");
    $state.go("market");
  }
});
