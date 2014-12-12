'use strict';

angular
.module('ecg.controllers')
.controller('AdminController', function($scope, Questions, Presets) {
  var self = this;

  this.questions = Questions;
  this.presets   = Presets;
  this.originalPresets = clone(this.presets);

  this.waveDescriptors = [ 'p', 'q', 'qrs', 's', 't', 'u' ];

  this.selectedPreset = this.presets.normal;
  this.resetSelectedPreset = function() {
    var id = self.selectedPreset.id;
    this.selectedPreset = this.presets[id] = clone(this.originalPresets[id]);
  };
})
