'use strict';

const _ = require('lodash');
const logCallsRemaining = require('./logCallsRemaining');
const findPrs = require('./findPrs');
const { getStatusCode, getErrorDescription } = require('./errors');

/**
 * GET /
 */
exports.index = (req, res) => {
  const github = req.app.get('github');
  const username = req.query.username;

  var hostname = process.env.APP_URL || `${req.protocol}://${req.headers.host}`;

  if (!username) {
    return res.status(400).json({
      error_description: 'No username provided!'
    });
  }

  Promise.all([
    findPrs(github, username),
    github.users.getForUser({ username })
      .then(logCallsRemaining)
  ])
    .then(([ prs, user ]) => {
      if (user.data.type !== 'User') {
        return Promise.reject('notUser');
      }

      const data = {
        prs,
        username,
        userImage: user.data.avatar_url,
        prAmount
      };

      res.json();
    })
    .catch((err) => {
      console.log(err);

      const statusCode = getStatusCode(err)
      const errorDescription = getErrorDescription(err);

      res.status(statusCode).json({
        error_description: errorDescription
      });
    });
};
