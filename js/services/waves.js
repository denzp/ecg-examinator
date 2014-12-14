'use strict';
var ITERATIONS = 100;

angular
.module('ecg.services')
.factory('PWave', function(Settings, Presets) {
  return function(preset, x, li) {
    x += preset.p.interval;
    var P = 0;

    var b = (2.0 * li) / preset.p.duration,
        signal = preset.p.positive ? 1 : -1;

    for(var i = 1; i <= ITERATIONS; ++i) {
      var t1 = Math.sin(Math.PI / (2 * b) * (b - 2 * i)) / (b - 2 * i);
      var t2 = Math.sin(Math.PI / (2 * b) * (b + 2 * i)) / (b + 2 * i);
      var t3 = Math.cos(i * Math.PI * x / li);

      P += signal * (t1 + t2) * (2 / Math.PI) * t3;
    }

    return P * preset.p.amplitude;
  }
})

.factory('QRSWave', function(Settings, Presets) {
  return function(preset, x, li) {
    var b   = (2 * li) / preset.qrs.duration;
    var QRS = preset.qrs.amplitude / ((2 * b) * (2 - b));

    for(var i = 1; i < ITERATIONS; ++i) {
      var t1 = 2 * b * preset.qrs.amplitude;
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
    x += preset.q.interval;

    var b = (2.0 * li) / preset.q.duration,
        signal = preset.q.positive ? 1 : -1;

    var Q = preset.q.amplitude / (2 * b) * (2 - b);

    for(var i = 1; i <= ITERATIONS; ++i) {
      var t1 = 2 * b * preset.q.amplitude;
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
    x -= preset.s.interval;

    var b = (2.0 * li) / preset.s.duration,
        signal = preset.s.positive ? 1 : -1;

    var S = preset.s.amplitude / (2 * b) * (2 - b);

    for(var i = 1; i <= ITERATIONS; ++i) {
      var t1 = 2 * b * preset.s.amplitude;
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
    x -= preset.t.interval + 0.045;
    var T = 0;

    var b = (2.0 * li) / preset.t.duration,
        signal = preset.t.positive ? 1 : -1;

    for(var i = 1; i <= ITERATIONS; ++i) {
      var t0 = Math.PI / (2 * b) * (b - (2 * i));
      var t1 = Math.sin(t0) / (b - (2 * i));
      var t2 = Math.sin(Math.PI / (2 * b) * (b + 2 * i));
      var t3 = Math.cos((i * Math.PI * x) / li);

      T += (t1 + t2 / (b + 2 * i)) * (2 / Math.PI) * signal * t3;
    }

    return T * preset.t.amplitude;
  }
})

.factory('UWave', function(Settings, Presets) {
  return function(preset, x, li) {
    x -= preset.u.interval;
    var U = 0;

    var b = (2.0 * li) / preset.u.duration,
        signal = preset.u.positive ? 1 : -1;

    for(var i = 1; i <= ITERATIONS; ++i) {
      var t1 = Math.sin(Math.PI / (2 * b) * (b - 2 * i)) / (b - 2 * i);
      var t2 = Math.sin(Math.PI / (2 * b) * (b + 2 * i)) / (b + 2 * i);
      var t3 = Math.cos(i * Math.PI * x / li);

      U += signal * (t1 + t2) * (2 / Math.PI) * t3;
    }

    return U * preset.u.amplitude;
  }
});
