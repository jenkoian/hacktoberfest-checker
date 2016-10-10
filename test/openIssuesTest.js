var chai = require('chai');
var expect = require('chai').expect;
var hacktoberfest = require('../hacktoberfest');

describe('Hactoberfest', function() {
  describe('Total Issues', function() {
    it('should initialize with zero issues', function() {
  	  expect(hacktoberfest.totalIssues).to.equal(0);
    });
  });
});