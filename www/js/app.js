// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','chat.controllers', 'angularPayments'])

//This filter will give us the index of the item in the array or null if not found.
.filter('messageByExpires', function() {
  return function(messages, messageExpires) {
    for(var i = 0, j = messages.length; i < j; i++) {
      var message = messages[i];
      if(message.expires == messageExpires) {
        return i;
      }
    }
    return null; //nothing found
  };
})


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('staging', {
      url: '/staging',
      templateUrl: 'templates/test.html',
      controller: 'StagingCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('service', {
      url: '/service/:id',
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'LoginCtrl'
    })
    .state('listings', {
      url: '/listings',
      templateUrl: 'templates/listings.html',
      controller: 'ListingCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
