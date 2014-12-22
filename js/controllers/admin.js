'use strict';

angular
.module('ecg.controllers')
.controller('AdminController', function($scope, QuestionStorage, Presets) {
  var self = this;

  this.questions = QuestionStorage.questions;
  this.presets   = Presets;

  this.waveDescriptors = [ 'p', 'q', 'qrs', 's', 't', 'u' ];

  this.selectedPreset = this.presets.normal;
  this.resetSelectedPreset = function() {
    var id = self.selectedPreset.id;
    this.selectedPreset = this.presets[id] = clone(this.originalPresets[id]);
  };

  this.getPresetInstance = function(presetName) {
    return self.presets[presetName];
  }
})
