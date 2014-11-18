'use strict';

angular
.module('ecg.services')

.factory('Noise', function(Settings) {
  var accumulator = [],
      mean        = 0;

  while(accumulator.length < Settings.lod / 10) {
    accumulator.push(Math.random());
  }

  for(var i = 0; i < accumulator.length; ++i) {
    mean += accumulator[i];
  }

  mean /= accumulator.length;

  return function Noise(x) {
    mean -= accumulator[0] / accumulator.length;

    accumulator.shift();
    accumulator.push(Math.random());

    mean += accumulator[accumulator.length - 1] / accumulator.length;

    return mean;
  };
})

.provider('ResultWave', function() {
  this.noiseStrength = 0.25;

  this.$get = function ResultWave(Noise, Composer) {
    var result = Composer('normal');

    return function(offset) {
      var waveAmplitude = result[offset % result.length];

      // add noise
      waveAmplitude += this.noiseStrength * Noise();

      return waveAmplitude;
    }.bind(this);
  };
});
