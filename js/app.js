'use strict';

angular.module('ecg.services', []);
angular.module('ecg.directives', []);
angular.module('ecg.controllers', []);

angular.module('ecg', [
  'ecg.services',
  'ecg.directives',
  'ecg.controllers',
  'ngRoute'
])

.run(function() {
  if(location.href.indexOf('#') >= 0) {
    location.href = /(.*)#/.exec(location.href)[1];
  }
})

.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/quiz', {
      templateUrl: 'templates/quiz.html',
      controller: 'QuizController'
    })
    .when('/admin', {
      templateUrl: 'templates/admin.html',
      controller: 'AdminController',
      controllerAs: 'admin'
    })
    .when('/teach', {
      templateUrl: 'templates/teach.html'
    })
    .otherwise({
      templateUrl: 'templates/index.html'
    });
});
