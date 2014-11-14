'use strict';

function waveStub(length) {
  var buf = new Array(length);
  for(var i = 0; i < length; ++i) {
    buf[i] = Math.random() / 6;
  }

  return buf;
}

var ITERATIONS = 100;

angular
.module('ecg.services')
.factory('PWave', function(Settings, Presets) {
  return function(preset) {
    var buf = new Array(Settings.lod);
    for(var i = 0; i < buf.length; ++i) {
      buf[i] = 0;
    }

    var li = 30 / Settings.heartRate;
    var b = (2.0 * li) / Presets[preset].p.duration;
    var signal = Presets[preset].p.positive ? 1 : -1;

    for(var iteration = 1; iteration <= ITERATIONS; ++iteration) {
      for(var i = 0; i < buf.length; ++i) {
        var k = (i / buf.length) + Presets[preset].p.interval;
        var t1 = Math.sin(Math.PI / (2 * b) * (b - 2 * iteration)) / (b - 2 * iteration);
        var t2 = Math.sin(Math.PI / (2 * b) * (b + 2 * iteration)) / (b + 2 * iteration);
        var t3 = (t1 + t2) * (2 / Math.PI);

        buf[i] += t3 * signal * Math.cos(iteration * Math.PI * k / li);
      }
    }

    for(var i = 0; i < buf.length; ++i) {
      buf[i] *= Presets[preset].p.amplitude;
    }

    return buf;
  }
})

.factory('QRSWave', function(Settings, Presets) {
  return function(preset) {
    var buf = new Array(Settings.lod);
    for(var i = 0; i < buf.length; ++i) {
      buf[i] = 0;
    }

    var li = 30 / Settings.heartRate;
    var b = (2 * li) / Presets[preset].qrs.duration;
    var signal = Presets[preset].qrs.positive ? 1 : -1;

    for(var iteration = 1; iteration < ITERATIONS; ++iteration) {
      for(var i = 0; i < buf.length; ++i) {
        var t1 = 2 * b * Presets[preset].qrs.amplitude;
        var t2 = iteration * iteration * Math.PI * Math.PI;
        var t3 = 1 - Math.cos(iteration * Math.PI / b);
        var t4 = Math.cos(iteration * Math.PI * (i / buf.length) / li);

        buf[i] += t1 / t2 * t3 * t4;
      }
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
    var buf = new Array(Settings.lod);
    for(var i = 0; i < buf.length; ++i) {
      buf[i] = 0;
    }

    var li = 30 / Settings.heartRate;
    var b = (2.0 * li) / Presets[preset].t.duration;
    var signal = Presets[preset].t.positive ? 1 : -1;

    for (var iteration = 1; iteration <= ITERATIONS; ++iteration) {
      for (var i = 0; i < buf.length; ++i) {
        var k = (i / buf.length) - Presets[preset].t.interval + 0.045;
        var t0 = Math.PI / (2 * b) * (b - (2 * iteration));
        var t1 = Math.sin(t0) / (b - (2 * iteration));
        var t2 = Math.sin(Math.PI / (2 * b) * (b + 2 * iteration));
        var t3 = Math.cos((iteration * Math.PI * k) / li);

        buf[i] += (t1 + t2 / (b + 2 * iteration)) * (2 / Math.PI) * signal * t3;
      }
    }

    for(var i = 0; i < buf.length; ++i) {
      buf[i] *= Presets[preset].t.amplitude;
    }

    return buf;
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
      PWave(preset),
      QRSWave(preset),
      //QWave(preset),
      //SWave(preset),
      TWave(preset),
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
