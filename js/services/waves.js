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
  return function() {
    // TODO
    return waveStub(Settings.lod);
  }
})

.factory('QRSWave', function(Settings, Presets) {
  return function() {
    // TODO
    return waveStub(Settings.lod);
  }
})

.factory('QWave', function(Settings, Presets) {
  return function() {
    // TODO
    return waveStub(Settings.lod);
  }
})

.factory('SWave', function(Settings, Presets) {
  return function() {
    // TODO
    return waveStub(Settings.lod);
  }
})

.factory('TWave', function(Settings, Presets) {
  return function() {
    // TODO
    return waveStub(Settings.lod);
  }
})

.factory('UWave', function(Settings, Presets) {
  return function() {
    // TODO
    return waveStub(Settings.lod);
  }
})

.factory('ResultWave', function(PWave, QRSWave, QWave, SWave, TWave, UWave) {
  return function() {
    var components = [
      PWave(),
      QRSWave(),
      QWave(),
      SWave(),
      TWave(),
      UWave()
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
  var result = ResultWave();

  return function(offset) {
    return result[offset % result.length];
  };
});
