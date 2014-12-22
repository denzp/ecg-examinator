'use strict';

function ECGSimulator(Settings, ctx, wave) {
  this.Settings = Settings;

  this.ctx  = ctx;
  this.wave = wave;
}

ECGSimulator.prototype.initialize = function($scope, attrs) {
  if($scope.noise === undefined) { $scope.noise = 0; }
  if(!$scope.width) { $scope.width = 800; }
  if(!$scope.height) {
    $scope.height = this.Settings.ppm * 30 + this.MARGIN.top + this.MARGIN.bottom;
  }

  $scope.grid = attrs.noGrid === undefined;

  this.reset($scope);
};

ECGSimulator.prototype.drawGrid = function(startX, width, height) {
  var linesPerHeight = Math.floor(height / this.Settings.ppm / 2),
  midHeight = Math.floor(height / 2) - 0.5;

  this.ctx.lineWidth = 1;

  for(var i = 0; i < linesPerHeight; ++i) {
    if(i % 5 === 0) {
      this.ctx.strokeStyle = 'rgb(255, 181, 118)';
    }
    else {
      this.ctx.strokeStyle = 'rgb(255, 227, 199)';
    }

    this.ctx.beginPath();
    this.ctx.moveTo(startX - 0.5, midHeight - i * this.Settings.ppm);
    this.ctx.lineTo(startX + width + 0.5, midHeight - i * this.Settings.ppm);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(startX - 0.5, midHeight + i * this.Settings.ppm);
    this.ctx.lineTo(startX + width + 0.5, midHeight + i * this.Settings.ppm);
    this.ctx.stroke();
  }

  var i = Math.floor(startX / this.Settings.ppm),
  currentX = i * this.Settings.ppm - 0.5;

  while(currentX < startX + width) {
    if(i % 5 === 0) {
      this.ctx.strokeStyle = 'rgb(255, 181, 118)';
    }
    else {
      this.ctx.strokeStyle = 'rgb(255, 227, 199)';
    }

    this.ctx.beginPath();
    this.ctx.moveTo(currentX, 0);
    this.ctx.lineTo(currentX, 0);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(currentX, 0);
    this.ctx.lineTo(currentX, height);
    this.ctx.stroke();

    ++i;
    currentX += this.Settings.ppm;
  }
};

ECGSimulator.prototype.run = function($scope, oneTime) {
  var self = this;

  this.clear($scope);

  window.requestAnimationFrame(function handler() {
    if(oneTime !== undefined) {
      self.drawStatic($scope);
    }
    else {
      self.draw($scope);
    }

    if(!$scope.shouldStopAnimation) {
      window.requestAnimationFrame(handler);
    }
  });
};

ECGSimulator.prototype.runInstantly = function($scope, oneTime) {
  this.clear($scope);

  while(!$scope.shouldStopAnimation) {
    this.drawStatic($scope);
  }
};

ECGSimulator.prototype.clear = function($scope) {
  this.ctx.clearRect(0, 0, $scope.width, $scope.height);

  if($scope.grid) {
    this.drawGrid(0, $scope.width, $scope.height);
  }

  this.draw1VHelper($scope);
  this.drawHeartbeats($scope);
};

ECGSimulator.prototype.draw1VHelper = function($scope) {
  this.ctx.lineWidth = 1.5;
  this.ctx.strokeStyle = 'rgb(0, 0, 0)';
  this.ctx.beginPath();
  this.ctx.moveTo(5,  this.translateY($scope.height, 0));
  this.ctx.lineTo(10, this.translateY($scope.height, 0));
  this.ctx.lineTo(10, this.translateY($scope.height, 1));
  this.ctx.lineTo(30, this.translateY($scope.height, 1));
  this.ctx.lineTo(30, this.translateY($scope.height, 0));
  this.ctx.lineTo(35, this.translateY($scope.height, 0));
  this.ctx.stroke();
  this.ctx.lineWidth = 1;
};

ECGSimulator.prototype.drawHeartbeats = function($scope) {
  this.ctx.textBaseline = 'top';

  this.ctx.fillStyle = 'black';
  this.ctx.font = 'bold 10pt monospace';
  this.ctx.fillText($scope.presetInstance.beats, 11.5, 5);
};

ECGSimulator.prototype.MARGIN = {
  left: 45,
  right: 10,
  top: 10,
  bottom: 10
};

ECGSimulator.prototype.draw = function($scope) {
  var pixelsPerSecond    = this.Settings.paperSpeed * this.Settings.ppm,
      pixelsPerHeartBeet = 60 * pixelsPerSecond / $scope.presetInstance.beats,
      stepX = pixelsPerHeartBeet / this.Settings.lod,
      cleanWidth = stepX * 2 + 75;

  var point = this.getNextPoint($scope, stepX);

  if(point.x >= $scope.width - this.MARGIN.right) {
    $scope.last.x = this.MARGIN.left - 1;
    point.x = this.MARGIN.left;
  }

  this.ctx.globalCompositeOperation = 'destination-out';
  this.ctx.fillStyle = this.ctx.createLinearGradient($scope.last.x, 0, $scope.last.x + cleanWidth, 0);
  this.ctx.fillStyle.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  this.ctx.fillStyle.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
  this.ctx.fillRect($scope.last.x, 0, cleanWidth, $scope.height);

  this.ctx.globalCompositeOperation = 'destination-over';
  if($scope.grid) {
    this.drawGrid($scope.last.x, cleanWidth, $scope.height);
  }

  this.ctx.globalCompositeOperation = 'source-over';

  this.ctx.lineWidth = 1.5;
  this.ctx.strokeStyle = 'rgb(0, 0, 0)';
  this.ctx.beginPath();
  this.ctx.moveTo($scope.last.x - 0.5, $scope.last.y);
  this.ctx.lineTo(point.x, point.y);
  this.ctx.stroke();

  $scope.last = point;
}

ECGSimulator.prototype.drawStatic = function($scope) {
  var pixelsPerSecond    = this.Settings.paperSpeed * this.Settings.ppm,
      pixelsPerHeartBeet = 60 * pixelsPerSecond / $scope.presetInstance.beats,
      stepX = pixelsPerHeartBeet / this.Settings.lod;

  var point = this.getNextPoint($scope, stepX);

  if(point.x >= $scope.width - this.MARGIN.right) {
    $scope.shouldStopAnimation = true;
    return;
  }

  this.ctx.lineWidth = 1.5;
  this.ctx.strokeStyle = 'rgb(0, 0, 0)';
  this.ctx.beginPath();
  this.ctx.moveTo($scope.last.x - 0.5, $scope.last.y);
  this.ctx.lineTo(point.x, point.y);
  this.ctx.stroke();

  $scope.last = point;
}

ECGSimulator.prototype.translateY = function(height, y) {
  var h = (height - this.MARGIN.top - this.MARGIN.bottom) / 2;
  return height - this.MARGIN.top - h - this.Settings.ppm * 10 * y;
};

ECGSimulator.prototype.getNextPoint = function($scope, stepX) {
  var x = $scope.last.x + stepX,
  y = this.wave($scope.last.offset);

  return {
    offset: $scope.last.offset + 1,
    x: x,
    y: this.translateY($scope.height, y)
  };
};

ECGSimulator.prototype.reset = function($scope) {
  $scope.shouldStopAnimation = undefined;

  $scope.last = {
    offset: 0,
    x: this.MARGIN.left,
    y: this.translateY($scope.height, this.wave(0))
  };
};

angular
.module('ecg.directives')

.directive('ecgSimulator', function(Presets, Settings, StaticWave) {
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
      var ctx = element.find('canvas')[0].getContext('2d');

      $scope.$watch('preset', function() {
        $scope.presetInstance = Presets[$scope.preset || 'normal'];
      });

      var simulator = new ECGSimulator(Settings, ctx, function(offset) {
        return StaticWave(offset, $scope.preset || 'normal', $scope.noise);
      });

      simulator.initialize($scope, attrs);
      setTimeout(simulator.run.bind(simulator, $scope, attrs.static));

      $scope.$on('ecg-simulator:reset', function() {
        simulator.clear($scope);
        simulator.reset($scope);
      });
    }
  };
})

.directive('ecgSimulatorDynamic', function(Settings, DynamicWave, Composer) {
  return {
    restrict: 'E',
    template: '<canvas width="{{width}}" height="{{height}}"></canvas>',

    scope: {
      width:  '=?',
      height: '=?',
      noise:  '=?',
      preset: '=',
    },

    link: function($scope, element, attrs) {
      var ctx  = element.find('canvas')[0].getContext('2d'),
          wave = Composer($scope.preset);

      var simulator = new ECGSimulator(Settings, ctx, function(offset) {
        return DynamicWave(offset, wave, $scope.noise);
      });

      $scope.$watch('preset', function(current, prev) {
        if(current === prev) {
          return;
        }

        $scope.presetInstance = $scope.preset;
        wave = Composer($scope.presetInstance);

        simulator.clear($scope);
        simulator.reset($scope);

        simulator.runInstantly($scope);
      }, true);

      $scope.presetInstance = $scope.preset;
      simulator.initialize($scope, attrs);

      setTimeout(simulator.runInstantly.bind(simulator, $scope));
    }
  };
});
