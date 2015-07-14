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
