'use strict';

angular
.module('ecg.services')

.service('Authentication', function() {
  var authenticated = false,
      login = undefined;

  return {
    get authenticated() {
      return authenticated;
    },
    get login() {
      return login;
    },
    signIn: function(pLogin, pPassword) {
      login = pLogin;
      authenticated = true;
      return authenticated;
    },
    signOut: function() {
      authenticated = false;
      return authenticated;
    }
  };
});