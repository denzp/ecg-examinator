var express = require('express');

express().use(express.static('.')).listen(2999, 'localhost');

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e/*-spec.js'],

  baseUrl: 'http://localhost:2999/',

  framework: 'jasmine',
  jasmineNodeOpts: {
    isVerbose: true
  }
};
