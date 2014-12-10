'use strict';

angular
.module('ecg.controllers')
.controller('PageController', function($scope, Authorization) {
  var self = this;

  this.user = Authorization;

  this.signIn = function() {
    self.user.signIn();
  };

  this.signOut = function() {
    self.user.signOut();
  };

  $scope.$on('authorization:error', function(e, message) {
    alert(message);
  });
})
