'use strict';

const logCallsRemaining = require('./logCallsRemaining');
const findPrs = require('./findPrs');
const { getStatusCode, getErrorDescription } = require('./errors');

/**
 * GET /
 */
exports.index = (req, res) => {
  const github = req.app.get('github');
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({
      error_description: 'No username provided!',
    });
  }

  Promise.all([
    findPrs(github, username),
    github.users.getByUsername({ username }).then(logCallsRemaining),
  ])
    .then(([prs, user]) => {
      if (user.data.type !== 'User') {
        return Promise.reject('notUser');
      }

      const data = {
        prs,
        username,
        userImage: user.data.avatar_url,
      };

      res.json(data);
    })
    .catch((err) => {
      console.log('Error: ' + err);

      const statusCode = getStatusCode(err);
      const errorDescription = getErrorDescription(err);

      res.status(statusCode).json({
        error_description: errorDescription,
      });
    });
};
