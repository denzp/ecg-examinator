'use strict';

angular
.module('ecg.services')

.factory('Noise', function(Settings) {
  var accumulator = [],
      mean        = 0;

  while(accumulator.length < Math.ceil(Math.log(Settings.lod) * 5)) {
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

.factory('WaveStorage', function(Composer) {
  var storage = { };

  return function(preset) {
    if(storage[preset]) {
      return storage[preset];
    }

    return storage[preset] = Composer(preset);
  };
})

.factory('ResultWave', function(Settings, WaveStorage, Noise) {
  return function(offset, preset, noise) {
    var waveAmplitude = WaveStorage(preset)[offset % Settings.lod];

    // add noise
    waveAmplitude += 2 * noise * (Noise() - 0.5);

    return waveAmplitude;
  };
});
