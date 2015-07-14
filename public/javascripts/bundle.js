'use strict'

var skill = angular.module("skill", ["ui.router"])
.constant("BASE_URL", "http:localhost:3000");

'use strict'

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
});

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

'use strict'

// skill.filter('transactionHistory', function() {
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
// });

skill.factory("SkillService", function($http) {
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
});

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

'use strict'

skill.factory('UserService', function ($rootScope, $http) {
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
});
