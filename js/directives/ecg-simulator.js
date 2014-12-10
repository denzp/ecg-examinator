'use strict';

angular
.module('ecg.directives')
.directive('ecgSimulator', function(Presets, Settings, ResultWave) {
  var margin = {
    left: 45,
    right: 10,
    top: 10,
    bottom: 10
  };

  function translateY(height, y) {
    var h = (height - margin.top - margin.bottom) / 2;
    return height - margin.top - h - Settings.ppm * 10 * y;
  }

  function getNextPoint($scope, stepX) {
    var x = $scope.last.x + stepX,
        y = ResultWave($scope.last.offset, $scope.preset || 'normal', $scope.noise);

    return {
      offset: $scope.last.offset + 1,
      x: x,
      y: translateY($scope.height, y)
    };
  }

  function drawGrid(x, width, height) {
    var linesPerHeight = Math.floor(height / Settings.ppm / 2),
        midHeight = Math.floor(height / 2) - 0.5;

    for(var i = 0; i < linesPerHeight; ++i) {
      if(i % 5 === 0) {
        this.strokeStyle = 'rgb(255, 181, 118)';
      }
      else {
        this.strokeStyle = 'rgb(255, 227, 199)';
      }

      this.beginPath();
      this.moveTo(x, midHeight - i * Settings.ppm);
      this.lineTo(x + width, midHeight - i * Settings.ppm);
      this.stroke();

      this.beginPath();
      this.moveTo(x, midHeight + i * Settings.ppm);
      this.lineTo(x + width, midHeight + i * Settings.ppm);
      this.stroke();
    }

    var i = Math.floor(x / Settings.ppm),
        currentX = i * Settings.ppm - 0.5;

    while(currentX < x + width) {
      if(i % 5 === 0) {
        this.strokeStyle = 'rgb(255, 181, 118)';
      }
      else {
        this.strokeStyle = 'rgb(255, 227, 199)';
      }

      this.beginPath();
      this.moveTo(currentX, 0);
      this.lineTo(currentX, 0);
      this.stroke();

      this.beginPath();
      this.moveTo(currentX, 0);
      this.lineTo(currentX, height);
      this.stroke();

      ++i;
      currentX += Settings.ppm;
    }
  }

  function drawHandler($scope) {
    var pixelsPerSecond    = Settings.paperSpeed * Settings.ppm,
        pixelsPerHeartBeet = 60 * pixelsPerSecond / Presets[$scope.preset || 'normal'].beats,
        stepX = pixelsPerHeartBeet / Settings.lod,
        cleanWidth = stepX * 2 + 75;

    var point = getNextPoint($scope, stepX);

    if(point.x >= $scope.width - margin.right) {
      if($scope.static) {
        $scope.shouldStopAnimation = true;
        return;
      }

      $scope.last.x = margin.left - 1;
      point.x = margin.left;
    }

    this.globalCompositeOperation = 'destination-out';
    this.fillStyle = this.createLinearGradient($scope.last.x, 0, $scope.last.x + cleanWidth, 0);
    this.fillStyle.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    this.fillStyle.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    this.fillRect($scope.last.x, 0, cleanWidth, $scope.height);

    this.globalCompositeOperation = 'destination-over';
    if($scope.grid) {
      drawGrid.call(this, $scope.last.x, cleanWidth, $scope.height);
    }

    this.globalCompositeOperation = 'source-over';

    this.strokeStyle = 'rgb(0, 0, 0)';
    this.beginPath();
    this.moveTo($scope.last.x, $scope.last.y);
    this.lineTo(point.x, point.y);
    this.stroke();

    $scope.last = point;
  }

  function initialDraw($scope, ctx) {
    ctx.clearRect(0, 0, $scope.width, $scope.height);

    if($scope.grid) {
      drawGrid.call(ctx, 0, $scope.width, $scope.height);
    }

    // draw 1V helper
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.beginPath();
    ctx.moveTo(5,  translateY($scope.height, 0));
    ctx.lineTo(10, translateY($scope.height, 0));
    ctx.lineTo(10, translateY($scope.height, 1));
    ctx.lineTo(30, translateY($scope.height, 1));
    ctx.lineTo(30, translateY($scope.height, 0));
    ctx.lineTo(35, translateY($scope.height, 0));
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  return {
    restrict: 'E',
    template: '<canvas width="{{width}}" height="{{height}}"></canvas>',

    scope: {
      width:  '=?',
      height: '=?',
      noise:  '=?',
      preset: '=?',
    },

    link: function($scope, element, attrs) {
      if(!$scope.width)  { $scope.width = 800; }
      if(!$scope.height) { $scope.height = Settings.ppm * 30 + margin.top + margin.bottom; }
      if($scope.noise === undefined) { $scope.noise = 0; }

      $scope.static = attrs.static !== undefined;
      $scope.grid   = attrs.noGrid === undefined;

      var ctx = element.find('canvas')[0].getContext('2d');

      $scope.last = {
        offset: 0,
        x: margin.left,
        y: translateY($scope.height, ResultWave(0, $scope.preset || 'normal', $scope.noise))
      };

      $scope.$on('reset-ecg-simulation', function() {
        $scope.last = {
          offset: 0,
          x: margin.left,
          y: translateY($scope.height, ResultWave(0, $scope.preset || 'normal', $scope.noise))
        };

        initialDraw($scope, ctx);
      });

      // should run on after canvas had been set
      setTimeout(function() {
        initialDraw($scope, ctx);

        window.requestAnimationFrame(function handler() {
          drawHandler.call(ctx, $scope);

          if(!$scope.shouldStopAnimation) {
            window.requestAnimationFrame(handler);
          }
        });
      });
    }
  };
});
