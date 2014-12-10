'use strict';

angular
.module('ecg.services')

.service('Authorization', function($rootScope) {
  var isAuthorized = false;

  return {
    get isAuthorized() {
      return isAuthorized;
    },
    get isAdmin() {
      return this.login === 'admin';
    },

    signIn: function(login, password) {
      delete this.password;
      return isAuthorized = true;
    },
    signOut: function() {
      delete this.login;
      return isAuthorized = false;
    }
  };
});
