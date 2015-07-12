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
  User.isLoggedIn = false;
  User.getUser = function(username) {
    return $http.get("/users/" + username);
  };
  User.setCurrentUser = function() {
    User.isLoggedIn = true;
    $rootScope.currentUser = true;
  }
  User.logoutCurrentUser = function() {
    User.isLoggedIn = false;
    $rootScope.currentUser = false;
    $rootScope.currentUserData = {};
  }
  User.getAllUsers = function() {
    return $http.get('/users');
  };
  return User;
})
.controller("NavCtrl", function($scope, $state, $rootScope, SkillService, UserService) {
  $rootScope.user = UserService.isLoggedIn;
  UserService.getAllUsers()
  .success(function(data) {
    console.log(data);
    $rootScope.user = true;
    $scope.userData = data;
  })
  .catch(function(error) {
    console.log(error)
  })
  $scope.postSkill = function() {
    SkillService.postSkill($scope.skill)
    .success(function(data) {
      alert("This post was successfully proccessed!");
    })
    .catch(function(error) {
      console.error(error);
    })
  }
  $scope.logout = function() {
    console.log('logout');
    UserService.logoutCurrentUser()
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
.controller("ProfileCtrl", function($scope, UserService) {
  var profile_id;
  $scope.user = {
    name: 'Stanley',
    email: 'stanleyliu@berkeley.edu',
    transactions: [
      { 
        person: 'Ryano',
        swapGive: 'Karate',
        swapTake: 'Regex',
        time: new Date
      },
      { 
        person: 'Sean',
        swapGive: 'Mandarin Chinese',
        swapTake: 'Arabic',
        time: new Date
      },
      {
        person: 'Trey',
        swapGive: 'Mechanical Engineering',
        swapTake: 'Nuclear Engineering',
        time: new Date
      }
    ]
  }
  // UserService.getProfile(profile_id)
  // .success(function(data) {
  //   console.log(data);
  // })
  // .catch(function(error) {
  //   console.log(error);
  // })
})


