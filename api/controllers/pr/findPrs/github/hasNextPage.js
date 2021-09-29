'use strict';

const getPageLinks = require('./getPageLinks');

const hasNextPage = (link) => {
  return getPageLinks(link).next;
};

module.exports = hasNextPage;
