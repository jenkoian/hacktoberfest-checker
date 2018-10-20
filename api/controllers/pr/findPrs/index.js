'use strict';

const _ = require('lodash');
const moment = require('moment');
const logCallsRemaining = require('../logCallsRemaining');
const loadPrs = require('./loadPrs');

const findPrs = (github, username) => {
  return loadPrs(github, username)
    .then(pullRequestData =>
      _.map(pullRequestData, event => {
        const repo = event.pull_request.html_url.substring(
          0,
          event.pull_request.html_url.search('/pull/')
        );

        const hacktoberFestLabels = _.some(
          event.labels,
          label => label.name.toLowerCase() === 'hacktoberfest'
        );

        return {
          has_hacktoberfest_label: hacktoberFestLabels,
          number: event.number,
          open: event.state === 'open',
          repo_name: repo.replace('https://github.com/', ''),
          title: event.title,
          url: event.html_url,
          created_at: moment(event.created_at).format('MMMM Do YYYY'),
          user: {
            login: event.user.login,
            url: event.user.html_url
          }
        };
      })
    )
    .then((prs) => {
      const checkMergeStatus = _.map(prs, (pr) => {
        const repoDetails = pr.repo_name.split('/');
        const pullDetails = {
          owner: repoDetails[0],
          repo: repoDetails[1],
          number: pr.number
        };

        return github.pullRequests
          .checkMerged(pullDetails)
          .then(logCallsRemaining)
          .then(res => res.meta.status === '204 No Content')
          .catch(err => {
            // 404 means there wasn't a merge
            if (err.code === 404) {
              return false;
            }

            throw err;
          });
      });

      return Promise.all(checkMergeStatus).then(mergeStatus =>
        _.zipWith(prs, mergeStatus, (pr, merged) => _.assign(pr, { merged }))
      );
    });
};

module.exports = findPrs;
