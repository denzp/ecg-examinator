'use strict';

angular
.module('ecg.controllers')
.directive('finalEcg', function(Settings, ResultWaveAccessor) {
  function getNextPoint($scope, xStep) {
    var x = $scope.last.x + xStep,
        y = ResultWaveAccessor($scope.last.offset);

    return {
      offset: $scope.last.offset + 1,
      x: x,
      y: $scope.width / 2 - y * $scope.width / 2
    }
  }

  function drawHandler($scope) {
    var xStep = Settings.paperSpeed * (60 / Settings.heartRate) / Settings.lod;
    var pt = getNextPoint($scope, xStep);

    if(pt.x >= $scope.width) {
      $scope.last.x = 0;
    }

    this.beginPath();
    this.moveTo($scope.last.x, $scope.last.y);
    this.lineTo(pt.x, pt.y);
    this.stroke();

    $scope.last = pt;
  }

  return {
    restrict: 'E',
    template: '<canvas width={{width}} height={{height}}></canvas>',

    scope: { lead: '=' },

    link: function($scope, element) {
      $scope.width  = 500;
      $scope.height = 150;
      var ctx = element.find('canvas')[0].getContext('2d');

      $scope.last = {
        offset: 0,
        x: 0,
        y: 0
      };

      window.requestAnimationFrame(function handler() {
        drawHandler.call(ctx, $scope);
        window.requestAnimationFrame(handler);
      });
    }
  };
});
