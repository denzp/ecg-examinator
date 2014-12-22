'use strict';

angular
.module('ecg.directives')
.directive('ecgShowcase', function(Cardio, Leads) {
  function drawHandler($scope) {
    var w = $scope.width,
        h = $scope.height;

    this.clearRect(0, 0, $scope.width, $scope.height);

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

    var dX = Cardio.value.x * w / 2,
        dY = Cardio.value.y * h / 2;

    this.moveTo($scope.heart.x, $scope.heart.y);
    this.lineTo($scope.heart.x + dX, $scope.heart.y + dY);

    var angle = Math.atan2(dY, dX);
    var length = 0.25 * Math.sqrt(dX * dX + dY * dY);

    this.lineTo(
      $scope.heart.x + dX - length * Math.cos(angle - Math.PI / 9),
      $scope.heart.y + dY - length * Math.sin(angle - Math.PI / 9));

    this.moveTo($scope.heart.x + dX, $scope.heart.y + dY);

    this.lineTo(
      $scope.heart.x + dX - length * Math.cos(angle + Math.PI / 9),
      $scope.heart.y + dY - length * Math.sin(angle + Math.PI / 9));

    this.strokeStyle = 'black';
    this.lineWidth = 1.5;
    this.stroke();
  }

  return {
    restrict: 'E',
    templateUrl: 'templates/directives/ecg-showcase.html',

    scope: { },

    link: function($scope, element) {
      $scope.width = 300;
      $scope.height = 300;
      var ctx = element.find('canvas')[0].getContext('2d');

      $scope.heart = { x: 150, y: 80 };

      window.requestAnimationFrame(function handler() {
        drawHandler.call(ctx, $scope);
        window.requestAnimationFrame(handler);
      });
    }
  };
});
