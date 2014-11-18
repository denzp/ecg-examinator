'use strict';
var ITERATIONS = 100;

angular
.module('ecg.services')
.factory('PWave', function(Settings, Presets) {
  return function(preset, x, li) {
    x += Presets[preset].p.interval;
    var P = 0;

    var b = (2.0 * li) / Presets[preset].p.duration,
        signal = Presets[preset].p.positive ? 1 : -1;

    for(var i = 1; i <= ITERATIONS; ++i) {
      var t1 = Math.sin(Math.PI / (2 * b) * (b - 2 * i)) / (b - 2 * i);
      var t2 = Math.sin(Math.PI / (2 * b) * (b + 2 * i)) / (b + 2 * i);
      var t3 = Math.cos(i * Math.PI * x / li);

      P += signal * (t1 + t2) * (2 / Math.PI) * t3;
    }

    return P * Presets[preset].p.amplitude;
  }
})

.factory('QRSWave', function(Settings, Presets) {
  return function(preset, x, li) {
    var b   = (2 * li) / Presets[preset].qrs.duration;
    var QRS = Presets[preset].qrs.amplitude / ((2 * b) * (2 - b));

    for(var i = 1; i < ITERATIONS; ++i) {
      var t1 = 2 * b * Presets[preset].qrs.amplitude;
      var t2 = i * i * Math.PI * Math.PI;
      var t3 = 1 - Math.cos(i * Math.PI / b);
      var t4 = Math.cos(i * Math.PI * x / li);

      QRS += t1 / t2 * t3 * t4;
    }

    return QRS;
  }
})

.factory('QWave', function(Settings, Presets) {
  return function(preset, x, li) {
    x += Presets[preset].q.interval;

    var b = (2.0 * li) / Presets[preset].q.duration,
        signal = Presets[preset].q.positive ? 1 : -1;

    var Q = Presets[preset].q.amplitude / (2 * b) * (2 - b);

    for(var i = 1; i <= ITERATIONS; ++i) {
      var t1 = 2 * b * Presets[preset].q.amplitude;
      var t2 = i * i * Math.PI * Math.PI;
      var t3 = 1 - Math.cos(i * Math.PI / b);
      var t4 = Math.cos((i * Math.PI * x) / li);

      Q += t1 / t2 * t3 * t4;
    }

    return -Q;
  }
})

.factory('SWave', function(Settings, Presets) {
  return function(preset, x, li) {
    x -= Presets[preset].s.interval;

    var b = (2.0 * li) / Presets[preset].s.duration,
        signal = Presets[preset].s.positive ? 1 : -1;

    var S = Presets[preset].s.amplitude / (2 * b) * (2 - b);

    for(var i = 1; i <= ITERATIONS; ++i) {
      var t1 = 2 * b * Presets[preset].s.amplitude;
      var t2 = i * i * Math.PI * Math.PI;
      var t3 = 1 - Math.cos(i * Math.PI / b);
      var t4 = Math.cos((i * Math.PI * x) / li);

      S += t1 / t2 * t3 * t4;
    }

    return -S;
  }
})

.factory('TWave', function(Settings, Presets) {
  return function(preset, x, li) {
    x -= Presets[preset].t.interval + 0.045;
    var T = 0;

    var b = (2.0 * li) / Presets[preset].t.duration,
        signal = Presets[preset].t.positive ? 1 : -1;

    for(var i = 1; i <= ITERATIONS; ++i) {
      var t0 = Math.PI / (2 * b) * (b - (2 * i));
      var t1 = Math.sin(t0) / (b - (2 * i));
      var t2 = Math.sin(Math.PI / (2 * b) * (b + 2 * i));
      var t3 = Math.cos((i * Math.PI * x) / li);

      T += (t1 + t2 / (b + 2 * i)) * (2 / Math.PI) * signal * t3;
    }

    return T * Presets[preset].t.amplitude;
  }
})

.factory('UWave', function(Settings, Presets) {
  return function(preset, x, li) {
    x -= Presets[preset].u.interval;
    var U = 0;

    var b = (2.0 * li) / Presets[preset].u.duration,
        signal = Presets[preset].u.positive ? 1 : -1;

    for(var i = 1; i <= ITERATIONS; ++i) {
      var t1 = Math.sin(Math.PI / (2 * b) * (b - 2 * i)) / (b - 2 * i);
      var t2 = Math.sin(Math.PI / (2 * b) * (b + 2 * i)) / (b + 2 * i);
      var t3 = Math.cos(i * Math.PI * x / li);

      U += signal * (t1 + t2) * (2 / Math.PI) * t3;
    }

    return U * Presets[preset].u.amplitude;
  }
})

.factory('Composer', function(Settings, PWave, QRSWave, QWave, SWave, TWave, UWave) {
  return function(preset) {
    var components = [
      PWave,
      QRSWave,
      QWave,
      SWave,
      TWave,
      //UWave
    ];

    var li = 30 / Settings.heartRate;

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
});
