'use strict';

angular
.module('ecg.services')
.value('Settings', {
  ppm: 5, // pixels per mm
  paperSpeed: 30, // mm per second

  // level of details per one heartbeet
  lod: 100
})

.factory('Presets', function() {
  var normal = {
    beats: 60, // per minute
    p:   { duration: 0.08,   amplitude: 0.15,  interval: 0.15,  visible: true,  positive: true  },
    q:   { duration: 0.066,  amplitude: 0.025, interval: 0.166, visible: true,  positive: false },
    qrs: { duration: 0.08,   amplitude: 1,                      visible: true,  positive: true  },
    s:   { duration: 0.066,  amplitude: 0.25,  interval: 0.09,  visible: true,  positive: false },
    t:   { duration: 0.18,   amplitude: 0.3,   interval: 0.2,   visible: true,  positive: true  },
    u:   { duration: 0.0476, amplitude: 0.035, interval: 0.433, visible: false, positive: true  }
  };

  var idioventricular = JSON.parse(JSON.stringify(normal));
  idioventricular.beats = 35;
  idioventricular.p.visible = false;
  idioventricular.q.visible = false;
  idioventricular.qrs.duration = 0.16;
  idioventricular.t.positive = false;

  return {
    normal: normal,
    idioventricularRhythm: idioventricular
  };
});
