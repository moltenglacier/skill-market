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
    },
    updateTransaction: function(transaction_id, updatedTransaction) {
      return $http.patch('/api/transactions/' + transaction_id, updatedTransaction)
    }
  }
})
// .filter('transactionHistory', function() {
//   return function(input, user) {
//     if (!input || !input.length) {return;}
//     var filtered = [], temp;
//     for (var i = 0; i < input.length; i++) {
//       if (input[i].userOne === user) {
//         filtered.push(input[i]);
//       }
//       if (input[i].userTwo === user) {
//         temp = Object.create(input[i]);
//         input[i].userOne = temp.userTwo;
//         input[i].userTwo = temp.userOne;
//         input[i].skillOne = temp.skillTwo;
//         input[i].skillTwo = temp.skillOne;
//         filtered.push(input[i]);
//       }
//     }
//     return filtered;
//   }
// })
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
      sweetAlert("This post was successfully proccessed!");
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
    $state.go("market");
  }
})
.controller("ProfileCtrl", function($scope, $state, UserService, SkillService, TransactionService) {
  var username = $state.params.id;
  UserService.getUser(username)
  .success(function(data) {
    console.log(data);
    $scope.user = data;
  })
  .catch(function(error) {
    console.error(error);
    sweetAlert("This user does not exist!");
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
})
.controller("ProfilepageCtrl", function($scope, $rootScope, $state, UserService, SkillService, TransactionService) {
  UserService.getUser($rootScope.currentUserData.displayName)
  .success(function(data) {
    console.log(data);
  })
  .catch(function(error) {
    console.error(error);
    sweetAlert("You are not logged in!");
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
    console.log(skillID);
    SkillService.deleteSkill(skillID)
    .success(function(data) {
      console.log("Successfully deleted skill!");
      sweetAlert("Successfully deleted skill!");
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
      sweetAlert("Successfully updated skill!");
      console.log(data);
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
    console.log(updatedTransaction)
    TransactionService.updateTransaction(transaction_id, updatedTransaction)
    .success(function(data) {
      console.log(data);
    })
    .catch(function(error) {
      console.error(error);
    })
  }
  $scope.rejectTransaction = function(deal) {
    var transaction_id = deal._id;
    deal.status = -1;
    var updatedTransaction = deal;
    console.log(updatedTransaction)
    TransactionService.updateTransaction(transaction_id, updatedTransaction)
    .success(function(data) {
      console.log(data);
    })
    .catch(function(error) {
      console.error(error);
    })
  }
})




