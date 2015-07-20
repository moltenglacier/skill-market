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
