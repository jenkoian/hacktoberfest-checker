'use strict';

const _ = require('lodash');
const moment = require('moment');
const logCallsRemaining = require('../logCallsRemaining');
const loadPrs = require('./loadPrs');

const findPrs = (github, username) => {
  return loadPrs(github, username)
    .then((pullRequestData) =>
      pullRequestData
        .filter((event) => {
          const isInvalid = event.labels.some((label) => {
            return (
              label.name.toLowerCase() === 'invalid' ||
              label.name.toLowerCase() === 'spam'
            );
          });

          return !isInvalid;
        })
        .map((event) => {
          const repo = event.pull_request.html_url.substring(
            0,
            event.pull_request.html_url.search('/pull/')
          );

          const hacktoberFestLabels = _.some(
            event.labels,
            (label) => label.name.toLowerCase() === 'hacktoberfest-accepted'
          );

          const twoWeeksOld = moment.utc().subtract(14, 'days').startOf('day');

          return {
            has_hacktoberfest_label: hacktoberFestLabels,
            number: event.number,
            open: event.state === 'open',
            repo_name: repo.replace('https://github.com/', ''),
            repo_must_have_topic: moment
              .utc(event.created_at)
              .isAfter('2020-10-03T12:00:00.000Z'),
            title: event.title,
            url: event.html_url,
            created_at: moment.utc(event.created_at).format('MMMM Do YYYY'),
            is_pending: moment.utc(event.created_at).isAfter(twoWeeksOld),
            user: {
              login: event.user.login,
              url: event.user.html_url,
            },
          };
        })
    )
    .then((prs) => {
      // Ensure each repo only gets one request for their topics
      const repoTopicRequests = _.uniq(
        prs.filter((pr) => pr.repo_must_have_topic).map((pr) => pr.repo_name)
      ).map((repo_name) => {
        const [owner, repo] = repo_name.split('/');
        const repoDetails = { owner, repo };
        return github.repos
          .getAllTopics(repoDetails)
          .then(logCallsRemaining)
          .then((res) => ({ repo_name, topics: res.data.names }));
      });

      return Promise.all(repoTopicRequests)
        .then((repoTopics) =>
          _.reduce(
            repoTopics,
            (map, { repo_name, topics }) => ({
              ...map,
              [repo_name]: topics,
            }),
            {}
          )
        )
        .then((repoTopicMap) =>
          _.map(prs, (pr) =>
            _.assign(
              pr,
              pr.repo_must_have_topic
                ? {
                    repo_has_hacktoberfest_topic: repoTopicMap[
                      pr.repo_name
                    ].some((topic) => topic.toLowerCase() === 'hacktoberfest'),
                  }
                : {}
            )
          )
        );
    })
    .then((prs) =>
      prs.filter((pr) => {
        // Operating under initial rules
        if (!pr.repo_must_have_topic) return true;
        // label OR topic
        return pr.has_hacktoberfest_label || pr.repo_has_hacktoberfest_topic;
      })
    )
    .then((prs) => {
      const checkMergeStatus = _.map(prs, (pr) => {
        const repoDetails = pr.repo_name.split('/');
        const pullDetails = {
          owner: repoDetails[0],
          repo: repoDetails[1],
          pull_number: pr.number,
        };

        return github.pulls
          .checkIfMerged(pullDetails)
          .then(logCallsRemaining)
          .then((res) => res.headers.status === '204 No Content')
          .catch((err) => {
            // 404 means there wasn't a merge
            if (err.code === 404) {
              return false;
            }

            throw err;
          });
      });

      return Promise.all(checkMergeStatus).then((mergeStatus) =>
        _.zipWith(prs, mergeStatus, (pr, merged) => _.assign(pr, { merged }))
      );
    })
    .then((prs) => {
      const checkApproval = _.map(prs, (pr) => {
        const repoDetails = pr.repo_name.split('/');
        const pullDetails = {
          owner: repoDetails[0],
          repo: repoDetails[1],
          pull_number: pr.number,
        };

        return github.pulls
          .listReviews(pullDetails)
          .then(logCallsRemaining)
          .then((res) =>
            res.data.some((review) => review.state === 'APPROVED')
          );
      });

      return Promise.all(checkApproval).then((approvalStatus) =>
        _.zipWith(prs, approvalStatus, (pr, approved) =>
          _.assign(pr, { approved })
        )
      );
    })
    .then((prs) =>
      prs.filter((pr) => {
        // Operating under initial rules
        if (!pr.repo_must_have_topic) return true;
        // label OR (topic AND (merged OR approved))
        return (
          pr.has_hacktoberfest_label ||
          (pr.repo_has_hacktoberfest_topic && (pr.merged || pr.approved))
        );
      })
    );
};

module.exports = findPrs;
