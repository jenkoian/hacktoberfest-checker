'use strict';

const statusCodes = {
  notUser: 400
};

const errorDescriptions = {
  notUser: 'Username must belong to a user account.'
};

const getStatusCode = error => statusCodes[error] || 400;

const getErrorDescription = error =>
  errorDescriptions[error] || 'Bad request!';

module.exports.getStatusCode = getStatusCode;
module.exports.getErrorDescription = getErrorDescription;
