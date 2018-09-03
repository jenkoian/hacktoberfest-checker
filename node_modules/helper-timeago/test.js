/*!
 * helper-timeago <https://github.com/jonschlinkert/helper-timeago>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var date = require('date.js');
var Handlebars = require('handlebars');
var _ = require('lodash');
var timeago = require('./');

describe('timeago helper', function () {
  it('should return the contents of a file:', function () {
    timeago(new Date()).should.equal('Just now');
  });

  it('should return the timeagoenated contents of a list of files:', function () {
    timeago(new Date('2/10/1995')).should.equal('19 years ago');
  });
});

describe('handlebars:', function () {
  it('should return a human-readable time phrase from the given a date', function() {
    Handlebars.registerHelper('timeago', timeago);
    Handlebars.compile('{{timeago date}}')({date: new Date()}).should.equal('Just now');
    Handlebars.compile('{{timeago date}}')({date: new Date('2/10/1995')}).should.equal('19 years ago');
    Handlebars.compile('{{timeago date}}')({date: '2/10/1995'}).should.equal('19 years ago');
    Handlebars.compile('{{timeago date}}')({date: date('yesterday')}).should.equal('Yesterday');
    Handlebars.compile('{{timeago date}}')({date: '11/01/2013'}).should.equal('1 year ago');
    Handlebars.compile('{{timeago date}}')({date: date('1 day ago')}).should.equal('Yesterday');
    Handlebars.compile('{{timeago "2/10/1995"}}')().should.equal('19 years ago');
    Handlebars.compile('{{timeago "11/01/2013"}}')().should.equal('1 year ago');
  });
});

describe('lodash:', function () {
  it('should work as a lodash mixin:', function () {
    _.mixin({timeago: timeago});
    _.template('<%= _.timeago(date) %>', {date: new Date()}).should.equal('Just now');
    _.template('<%= _.timeago(date) %>', {date: new Date('2/10/1995')}).should.equal('19 years ago');
    _.template('<%= _.timeago(date) %>', {date: '2/10/1995'}).should.equal('19 years ago');
  });

  it('should work when passed to lodash on the context:', function () {
    var settings = {imports: {timeago: timeago}};
    _.template('<%= timeago(new Date()) %>', {timeago: timeago}).should.equal('Just now');
    _.template('<%= timeago("2/10/1995") %>', {timeago: timeago}).should.equal('19 years ago');
  });

  it('should work as a lodash import:', function () {
    var settings = {imports: {timeago: timeago}};
    _.template('<%= timeago(new Date()) %>', {}, settings).should.equal('Just now');
    _.template('<%= timeago("2/10/1995") %>', {}, settings).should.equal('19 years ago');
  });
});