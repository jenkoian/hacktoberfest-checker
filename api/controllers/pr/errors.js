'use strict';

const statusCodes = {
  notUser: 400,
};

const errorDescriptions = {
  notUser: 'Username must belong to a user account.',
};

const getStatusCode = (error) => statusCodes[error] || 400;

const getErrorDescription = (error) =>
  errorDescriptions[error] ||
  "Couldn't find any data or we hit an error, err try again?";

module.exports.getStatusCode = getStatusCode;
module.exports.getErrorDescription = getErrorDescription;
