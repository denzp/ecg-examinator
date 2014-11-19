'use strict';

angular
.module('ecg.controllers')
.controller('MainController', function($scope, Authentication, Questions) {

  $scope.authenticated = Authentication.authenticated;
  $scope.user = { };

  $scope.signIn = function() {
    $scope.authenticated = Authentication.signIn($scope.user.login, $scope.user.password);
  };

  $scope.signOut = function() {
    $scope.authenticated = Authentication.signOut();
    $scope.user.password = '';
  };

  $scope.questNum = 0,
  $scope.questCount = 5;
  $scope.correct = 0;
  var questions = Questions($scope.questCount);
  $scope.questCount = questions.length;

  $scope.getNextQuestion = function() {
    $scope.$broadcast('reset-ecg-simulation');

    if($scope.question && $scope.question.answers[$scope.question.choice].correct) {
      $scope.correct++;
    }
    if(questions[$scope.questNum]) {
      $scope.question = questions[$scope.questNum++];
    }
    else {
      $scope.question = undefined;
      $scope.questNum++;
    }
  };

  $scope.getNextQuestion();

  $scope.makeChoise = function(index) {
    $scope.question.choice = index;
  };

});
