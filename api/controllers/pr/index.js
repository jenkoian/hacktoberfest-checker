'use strict';

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

      // Combine github PRs with the gitlab MRs.
      prs = prs.concat(mrs);

      // TODO: If user is empty, try looking them up on gitlab.

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
