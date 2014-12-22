'use strict';

angular
.module('ecg.directives')
.directive('ecgShowcase', function(Cardio, Leads) {
  function drawHandler($scope) {
    var w = $scope.width,
        h = $scope.height;

    //this.clearRect(0, 0, $scope.width, $scope.height);
    this.fillStyle = 'rgba(255, 255, 255, 0.02)';
    this.fillRect(0, 0, $scope.width, $scope.height);

    Leads.forEach(function(lead) {
      this.beginPath();
      this.moveTo(
        $scope.heart.x + lead.e1.x * w,
        $scope.heart.y - lead.e1.y * h);
      this.lineTo(
        $scope.heart.x + lead.e2.x * w,
        $scope.heart.y - lead.e2.y * h);

      this.strokeStyle = lead.color;
      this.lineWidth = 2.5;
      this.stroke();
    }.bind(this));

    this.beginPath();

    this.arc(
      $scope.heart.x + Cardio.value.x * w / 2,
      $scope.heart.y + Cardio.value.y * h / 2,
      0.5, 0, Math.PI * 2);

    this.strokeStyle = 'black';
    this.lineWidth = 1.5;
    this.stroke();
  }

  return {
    restrict: 'E',
    template: '<canvas width={{width}} height={{height}}>',

    scope: { },

    link: function($scope, element) {
      $scope.width = 300;
      $scope.height = 300;
      var ctx = element.find('canvas')[0].getContext('2d');

      $scope.heart = { x: 90, y: 70 };

      window.requestAnimationFrame(function handler() {
        drawHandler.call(ctx, $scope);
        window.requestAnimationFrame(handler);
      })
    }
  };
});
