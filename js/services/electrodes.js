'use strict';

angular
.module('ecg.services')
.constant('Electrodes', {
  leftArm:  { x: 0.6,  y: 0.15 },
  rightArm: { x: -0.2, y: 0.15 },
  leftLeg:  { x: 0.2,    y: -0.6 },
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
