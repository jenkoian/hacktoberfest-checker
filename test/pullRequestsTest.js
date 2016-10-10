var chai = require('chai');
var expect = require('chai').expect;
var userInfo = require('../userInfo');

describe('Github User', function() {
  describe('Default PRs', function() {
    it('should initialize with no pull requests', function() {
  	  expect(userInfo.octoberOpenPrs).to.be.empty;
    });
  });
});