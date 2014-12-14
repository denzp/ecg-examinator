'use strict';

angular
.module('ecg.services')

.factory('Composer', function(Settings, PWave, QRSWave, QWave, SWave, TWave, UWave) {
  return function(preset) {
    var components = [];

    if(preset.p.visible)   { components.push(PWave); }
    if(preset.qrs.visible) { components.push(QRSWave); }
    if(preset.q.visible)   { components.push(QWave); }
    if(preset.s.visible)   { components.push(SWave); }
    if(preset.t.visible)   { components.push(TWave); }
    if(preset.u.visible)   { components.push(UWave); }

    var li = 30 / 60;

    var result = new Array(Settings.lod);
    for(var i = 0; i < result.length; ++i) {
      result[i] = -0.038; // magic!
    }

    for(var offset = 0; offset < result.length; ++offset) {
      var x = offset / Settings.lod;

      for(var i = 0; i < components.length; ++i) {
        result[offset] += components[i](preset, x, li);
      }
    }

    return result;
  };
})

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

.factory('StaticWaveStorage', function(Presets, Composer) {
  var storage = { };

  return function(preset) {
    if(storage[preset]) {
      return storage[preset];
    }

    return storage[preset] = Composer(Presets[preset]);
  };
})

.factory('StaticWave', function(Settings, StaticWaveStorage, Noise) {
  return function(offset, preset, noise) {
    var waveAmplitude = StaticWaveStorage(preset)[offset % Settings.lod];

    // add noise
    waveAmplitude += 2 * noise * (Noise() - 0.5);

    return waveAmplitude;
  };
})

.factory('DynamicWave', function(Settings, Noise) {
  return function(offset, wave, noise) {
    var waveAmplitude = wave[offset % Settings.lod];

    // add noise
    waveAmplitude += 2 * noise * (Noise() - 0.5);

    return waveAmplitude;
  }
});
