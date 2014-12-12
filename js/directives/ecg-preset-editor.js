'use strict';

angular
.module('ecg.directives')
.directive('ecgPresetEditor', function() {

  return {
    restrict: 'E',
    templateUrl: 'templates/directives/ecg-preset-editor.html',

    scope: {
      preset: '='
    },

    link: function($scope, element) {

    }
  };
});
