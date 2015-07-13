console.log('this is script');
var skill = angular.module("skill", ["ui.router"]);
skill.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  // $locationProvider.html5Mode({ enabled: true, requireBase: false });
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('market', {
      url: "/",
      templateUrl: "/views/market.html",
      controller: "MarketCtrl"
    })
    .state('signup', {
      url: "/signup",
      templateUrl: "/views/signup.html",
      controller: "SignupCtrl"
    })
    .state('skill', {
      url: "/skill/:id",
      templateUrl: "/views/skill.html",
      controller: "SkillCtrl"
    })
    .state('profile', {
      url: "/currentuser",
      templateUrl: "/views/profilepage.html",
      controller: "ProfilepageCtrl"
    })
    .state('otherProfile', {
      url: "/profile/:id",
      templateUrl: "/views/profile.html",
      controller: "ProfileCtrl"      
    })
})
.constant("BASE_URL", "http:localhost:3000")
.factory("SkillService", function($http) {
  return {
    getAllSkills: function() {
      return $http.get('/api/skills');
    },
    getOneSkill: function(skill_id) {
      return $http.get('/api/skills/' + skill_id);
    },
    postSkill: function(skill) {
      return $http.post('/api/skills', skill);
    }
  }
})
.factory('UserService', function($rootScope, $http, BASE_URL) {
  var User = {};
  User.getUser = function(username) {
    return $http.get("/users/" + username);
  };
  // User.setCurrentUser = function() {
  //   $rootScope.currentUserData.loggedIn = true;
  //   $rootScope.currentUser = true;
  // }
  User.logoutCurrentUser = function() {
    $rootScope.currentUserData = {};
    $rootScope.currentUserData.loggedIn = false;
  }
  User.getAllUsers = function() {
    return $http.get('/users');
  };
  User.getCurrentUser = function() {
    return $http.get('/currentuser');
  };
  User.postUserSkill = function(username, skill) {
    return $http.post('/users/' + username + '/skills', skill);
  };
  return User;
})
.controller("NavCtrl", function($scope, $state, $rootScope, SkillService, UserService) {
  UserService.getCurrentUser()
  .success(function(data) {
    $rootScope.currentUserData = data;
    $rootScope.currentUserData.loggedIn = true;
  })
  .catch(function(error) {
    console.log(error);
    $rootScope.currentUserData.loggedIn = false;
  })
  $scope.postSkill = function() {
    $scope.skill.name = $rootScope.currentUserData.displayName;
    SkillService.postSkill($scope.skill)
    .success(function(data) {
      alert("This post was successfully proccessed!");
    })
    .catch(function(error) {
      console.error(error);
    })
    UserService.postUserSkill($rootScope.currentUserData.displayName, $scope.skill)
    .success(function(data) {
      console.log(data);
      data.skills.push($scope.skill);
    })
    .catch(function(error) {
      console.error(error);
    })
  }
  $scope.logout = function() {
    console.log('logout');
    UserService.logoutCurrentUser();
  }
})
.controller("SignupCtrl", function($scope) {})
.controller("MarketCtrl", function($scope, SkillService) {
  SkillService.getAllSkills()
  .success(function(data) {
    console.log("Data retrieved successfully!");
    $scope.posts = data;
  })
  .catch(function(error) {
    console.error(error);
  })
})
.controller("SkillCtrl", function($scope, $state, SkillService) {
  var skill_id = $state.params.id;
  SkillService.getOneSkill(skill_id)
  .success(function(data) {
    console.log(data);
    $scope.skill = data;
  })
  .catch(function(error) {
    console.error(error);
  })
})
.controller("ProfileCtrl", function($scope, $state, UserService) {
  var username = $state.params.id;
  UserService.getUser(username)
  .success(function(data) {
    console.log(data);
    $scope.user = data;
  })
  .catch(function(error) {
    console.error(error);
    alert("This user does not exist!");
    $state.go("market");
  })

  // var profile_id;
  // $scope.user = {
  //   name: 'Stanley',
  //   email: 'stanleyliu@berkeley.edu',
  //   transactions: [
  //     { 
  //       person: 'Ryano',
  //       swapGive: 'Karate',
  //       swapTake: 'Regex',
  //       time: new Date
  //     },
  //     { 
  //       person: 'Sean',
  //       swapGive: 'Mandarin Chinese',
  //       swapTake: 'Arabic',
  //       time: new Date
  //     },
  //     {
  //       person: 'Trey',
  //       swapGive: 'Mechanical Engineering',
  //       swapTake: 'Nuclear Engineering',
  //       time: new Date
  //     }
  //   ]
  // }

})
.controller("ProfilepageCtrl", function($scope, $rootScope, $state, UserService) {
  UserService.getUser($rootScope.currentUserData.displayName)
  .success(function(data) {
    console.log(data);
  })
  .catch(function(error) {
    console.error(error);
    alert("You are not logged in!");
    $state.go("market");
  })
})


