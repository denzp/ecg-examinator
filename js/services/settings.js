'use strict';

angular
.module('ecg.services')
.value('Settings', {
  heartRate: 60,
  paperSpeed: 50 * 1,

  // size of one heartbeet interval
  lod: 400
})

.factory('Presets', function() {
  var normal = {
    p:   { duration: 0.08,   amplitude: 0.15,  interval: 0.15,  visible: true,  positive: true  },
    q:   { duration: 0.066,  amplitude: 0.025, interval: 0.166, visible: true,  positive: false },
    qrs: { duration: 0.08,   amplitude: 1,                      visible: true,  positive: true  },
    s:   { duration: 0.066,  amplitude: 0.25,  interval: 0.09,  visible: true,  positive: false },
    t:   { duration: 0.18,   amplitude: 0.3,   interval: 0.2,   visible: true,  positive: true  },
    u:   { duration: 0.0476, amplitude: 0.035, interval: 0.433, visible: false, positive: true  }
  };

  return {
    normal: normal
  };
});
