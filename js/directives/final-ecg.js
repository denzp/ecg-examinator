'use strict';

angular
.module('ecg.controllers')
.directive('finalEcg', function(Reader) {
  function drawHandler($scope, offset) {
    this.clearRect($scope.offset, 0, 11, $scope.height);

    this.beginPath();
    this.moveTo($scope.offset, $scope.lastValue);

    $scope.offset += 0.2;
    if($scope.offset >= $scope.width) {
      $scope.offset = 0;
      this.moveTo($scope.offset, $scope.lastValue);
    }

    $scope.lastValue = $scope.height / 2 * (2 - Reader.getLeadByIndex($scope.lead));
    this.lineTo($scope.offset, $scope.lastValue);
    this.stroke();
  }

  return {
    restrict: 'E',
    template: '<canvas width={{width}} height={{height}}>',

    scope: { lead: '=' },

    link: function($scope, element) {
      $scope.width = 500;
      $scope.height = 150;
      var ctx = element.find('canvas')[0].getContext('2d');

      $scope.offset = 0;
      $scope.lastValue = 0;

      window.requestAnimationFrame(function handler() {
        drawHandler.call(ctx, $scope);
        window.requestAnimationFrame(handler);
      })
    }
  };
});
