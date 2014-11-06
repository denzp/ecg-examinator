'use strict';

angular
.module('ecg.services')
.service('Reader', function(Cardio, Leads) {
  this.getLeadByIndex = function(index) {
    var value = Cardio.value,
        leadX = Leads[index].e2.x - Leads[index].e1.x,
        leadY = Leads[index].e2.y - Leads[index].e1.y,
        alpha = Math.atan2(leadY, leadX),
        x = value.x * Math.sin(alpha) + Leads[index].e1.x,
        y = value.y * Math.cos(alpha) + Leads[index].e1.y;

    return Math.sqrt(x * x + y * y);
  };
});
