'use strict';

angular
.module('ecg.controllers')
.controller('QuizController', function($scope, Authorization, Questions) {
  $scope.questNum = 0,
  $scope.questCount = 5;
  $scope.correct = 0;

  var questions = Questions($scope.questCount);
  $scope.questCount = questions.length;

  $scope.getNextQuestion = function() {
    $scope.$broadcast('ecg-simulator:reset');

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
