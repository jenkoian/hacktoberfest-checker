'use strict';

const moment = require('moment');
const logCallsRemaining = require('./logCallsRemaining');
const findGithubPrs = require('./findPrs/github');
const findGitlabPrs = require('./findPrs/gitlab');
const { getStatusCode, getErrorDescription } = require('./errors');

/**
 * GET /
 */
exports.index = (req, res) => {
  const github = req.app.get('github');
  const gitlab = req.app.get('gitlab');
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({
      error_description: 'No username provided!',
    });
  }

  Promise.all([
    findGithubPrs(github, username),
    findGitlabPrs(gitlab, username),
    github.users.getByUsername({ username }).then(logCallsRemaining),
  ])
    .then(([prs, mrs, user]) => {
      if (user.data.type !== 'User') {
        return Promise.reject('notUser');
      }

      // Combine github PRs with the gitlab MRs in sorted order.
      // Most recent PRs/MRs will come first.
      prs = prs.concat(mrs).sort((pr1, pr2) => {
        const date1 = moment(pr1.created_at, 'MMMM Do YYYY');
        const date2 = moment(pr2.created_at, 'MMMM Do YYYY');
        if (date1.isSame(date2)) return 0;
        else if (date1.isAfter(date2)) return -1;
        return 1;
      });

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
