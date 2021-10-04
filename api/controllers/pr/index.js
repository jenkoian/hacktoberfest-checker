'use strict';

const moment = require('moment');
const logCallsRemaining = require('./logCallsRemaining');
const [findGithubPrs, searchGithubUser] = require('./findPrs/github');
const [findGitlabPrs, searchGitlabUser] = require('./findPrs/gitlab');
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
    searchGithubUser(github, username),
    searchGitlabUser(gitlab, username),
  ])
    .then(([prs, mrs, user, gitlab_user]) => {
      let isGitHubUser = true;
      let isGitLabUser = true;

      if (JSON.stringify(user) == JSON.stringify([])) isGitHubUser = false;

      if (JSON.stringify(gitlab_user) == JSON.stringify([]))
        isGitLabUser = false;

      if (!isGitHubUser && !isGitLabUser) {
        return Promise.reject('notUser');
      }

      // Combine github PRs with the gitlab MRs in sorted order.
      // Most recent PRs/MRs will come first.
      if (prs == null) {
        prs = [];
      }

      prs = prs.concat(mrs).sort((pr1, pr2) => {
        const date1 = moment(pr1.created_at, 'MMMM Do YYYY');
        const date2 = moment(pr2.created_at, 'MMMM Do YYYY');
        if (date1.isSame(date2)) return 0;
        else if (date1.isAfter(date2)) return -1;
        return 1;
      });

      // TODO: If user is empty, try looking them up on gitlab.
      if (!isGitHubUser && isGitLabUser) {
        user = gitlab_user;
      }

      const data = {
        prs,
        username,
        userImage: isGitHubUser ? user.data.avatar_url : user[0].avatar_url,
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
