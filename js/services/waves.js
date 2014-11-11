'use strict';

function waveStub(length) {
  var buf = new Array(length);
  for(var i = 0; i < length; ++i) {
    buf[i] = Math.random() / 6;
  }

  return buf;
}

angular
.module('ecg.services')
.factory('PWave', function(Settings, Presets) {
  return function(preset) {
    // TODO
    return waveStub(Settings.lod);
  }
})

.factory('QRSWave', function(Settings, Presets) {
  return function(preset) {
    var buf = new Array(Settings.lod);

    var li = 30 / Settings.heartRate;
    var b = (2 * li) / Presets[preset].qrs.duration;
    var signal = Presets[preset].qrs.positive ? 1 : -1;

    // Each value from x matrix is calculated using the formula bellow, resulting in a 1x200 matrix
    for(var i = 0; i < buf.length; i++) {
        buf[i] = /*buf[i] +*/ (((2 * b * Presets[preset].qrs.amplitude) / (i * i * Math.PI * Math.PI)) *
                (1 - Math.cos((i * Math.PI) / b))) * Math.cos((i * Math.PI) / li);
    }

    return buf;
  }
})

.factory('QWave', function(Settings, Presets) {
  return function(preset) {
    // TODO
    return waveStub(Settings.lod);
  }
})

.factory('SWave', function(Settings, Presets) {
  return function(preset) {
    // TODO
    return waveStub(Settings.lod);
  }
})

.factory('TWave', function(Settings, Presets) {
  return function(preset) {
    // TODO
    return waveStub(Settings.lod);
  }
})

.factory('UWave', function(Settings, Presets) {
  return function(preset) {
    // TODO
    return waveStub(Settings.lod);
  }
})

.factory('ResultWave', function(PWave, QRSWave, QWave, SWave, TWave, UWave) {
  return function(preset) {
    var components = [
      //PWave(preset),
      QRSWave(preset),
      //QWave(preset),
      //SWave(preset),
      //TWave(preset),
      //UWave(preset)
    ];

    var result = new Array(components[0].length);
    for(var i = 0; i < result.length; ++i) {
      result[i] = 0;
    }

    components.forEach(function(component) {
      for(var i = 0; i < component.length; ++i) {
        result[i] += component[i];
      }
    });

    return result;
  };
})

.factory('ResultWaveAccessor', function(ResultWave) {
  var result = ResultWave('normal');

  return function(offset) {
    return result[offset % result.length];
  };
});
