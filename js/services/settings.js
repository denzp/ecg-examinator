'use strict';

angular
.module('ecg.services')
.value('Settings', {
  heartRate: 60,
  paperSpeed: 50 * 1,

  // size of one heartbeet interval
  lod: 400
})

.value('Presets', {
  // TODO
});
