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
    .state('transaction', {
      url: "/transaction",
      templateUrl: "/views/transaction.html",
      controller: "TransactionCtrl"
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
    },
    deleteSkill: function(skill_id) {
      return $http.delete('/api/skills/' + skill_id)
    },
    editSkill: function(skill_id, updatedSkill) {
      return $http.patch('/api/skills/' + skill_id, updatedSkill)
    }
  }
})
.factory('UserService', function($rootScope, $http, BASE_URL) {
  return {
    getUser: function(username) {
      return $http.get("/users/" + username);
    },
    logoutCurrentUser: function() {
      $rootScope.currentUserData = {};
      $rootScope.currentUserData.loggedIn = false;
    },
    getAllUsers: function() {
      return $http.get('/users');
    },
    getCurrentUser: function() {
      return $http.get('/currentuser');
    }
  }
})
.factory('TransactionService', function($http, BASE_URL) {
  return {
    postTransaction: function(transaction) {
      return $http.post('/api/transactions', transaction);
    },
    getAllTransactions: function() {
      return $http.get('/api/transactions');
    }
  }
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
  }
  $scope.logout = function() {
    console.log('logout');
    UserService.logoutCurrentUser();
    $state.go("market");
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
.controller("SkillCtrl", function($scope, $rootScope, $state, SkillService, TransactionService) {
  var skill_id = $state.params.id;
  SkillService.getOneSkill(skill_id)
  .success(function(data) {
    console.log(data);
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
    // console.log(skillToTrade[0]);
    // console.log($scope.skill);
    var transaction = {
      userOne: skillToTrade[0].name,
      userTwo: $scope.skill.name,
      skillOne: skillToTrade[0].skillTitle,
      skillTwo: $scope.skill.skillTitle,
      status: 0,
    }
    TransactionService.postTransaction(transaction)
    .success(function(data) {
      console.log(data);
      console.log("Transaction submitted!");
    })
    .catch(function(error) {
      console.error(error);
    })
  }
})
.controller("ProfileCtrl", function($scope, $state, UserService, SkillService) {
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
  SkillService.getAllSkills()
  .success(function(data) {
    $scope.skills = data;
  })
  .catch(function(error) {
    console.error(error);
  })
})
.controller("ProfilepageCtrl", function($scope, $rootScope, $state, UserService, SkillService, TransactionService) {
  UserService.getUser($rootScope.currentUserData.displayName)
  .success(function(data) {
    console.log(data);
  })
  .catch(function(error) {
    console.error(error);
    alert("You are not logged in!");
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
    console.log(data);
    $scope.transactions = data;
  })
  .catch(function(error) {
    console.error(error);
  })
  $scope.deletePost = function(index) {
    SkillService.deleteSkill($scope.skills[index]._id)
    .success(function(data) {
      console.log("Successfully deleted skill!");
    })
    .catch(function(error) {
      console.error("Did not delete skill!");
    })
  }
  $scope.editPost = function(index) {
    $scope.editIndex = index;
  }
  $scope.submitPost = function(index) {
    // console.log($scope.update);
    // $scope.skills[index].skillTitle = $scope.update.skillTitle;
    // $scope.skills[index].skillCategory = $scope.update.skillCategory;
    // $scope.skills[index].description = $scope.update.description;
    // SkillService.editSkill($scope.skills[index]._id, $scope.skills[index])
    // .success(function(data) {
    //   console.log("Successfully updated skill!");
    //   console.log(data);
    // })
    // .catch(function(error) {
    //   console.log(error);
    // })
    $scope.editIndex = false;
    console.log($scope.skills[index]);
    console.log($scope.skills[index].skillTitle);
    console.log($scope.skills[index].skillCategory);
    console.log($scope.skills[index].description);
  }
})
.controller("TransactionCtrl", function($scope) {

})


