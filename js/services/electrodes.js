'use strict';

angular
.module('ecg.services')
.constant('Electrodes', {
  leftArm:  { x: 0.38,  y: 0.18  },
  rightArm: { x: -0.4,  y: 0.18  },
  leftLeg:  { x: -0.01, y: -0.65 },
})

.factory('Leads', function(Electrodes) {
  return [
    {
      name: 'I',
      color: 'green',
      e1: Electrodes.leftArm,
      e2: Electrodes.rightArm
    },
    {
      name: 'II',
      color: 'red',
      e1: Electrodes.leftLeg,
      e2: Electrodes.rightArm
    },
    {
      name: 'III',
      color: 'blue',
      e1: Electrodes.leftLeg,
      e2: Electrodes.leftArm
    },
  ];
});
