'use strict';

const _ = require('lodash');
const moment = require('moment');
const logCallsRemaining = require('../logCallsRemaining');
const loadPrs = require('./loadPrs');

const findPrs = (github, username) => {
  return loadPrs(github, username)
    .then(pullRequestData =>
      pullRequestData
        .filter(event => {
          const isInvalid = event.labels.some(label => {
            return (
              label.name.toLowerCase() === 'invalid' ||
              label.name.toLowerCase() === 'spam'
            );
          });

          return !isInvalid;
        })
        .map(event => {
          const repo = event.pull_request.html_url.substring(
            0,
            event.pull_request.html_url.search('/pull/')
          );

          const hacktoberFestLabels = _.some(
            event.labels,
            label => label.name.toLowerCase() === 'hacktoberfest-accepted'
          );

          const twoWeeksOld = moment()
            .subtract(14, 'days')
            .startOf('day');

          return {
            has_hacktoberfest_label: hacktoberFestLabels,
            number: event.number,
            open: event.state === 'open',
            repo_name: repo.replace('https://github.com/', ''),
            title: event.title,
            url: event.html_url,
            created_at: moment(event.created_at).format('MMMM Do YYYY'),
            is_pending: moment(event.created_at).isAfter(twoWeeksOld),
            repo_must_have_topic: moment(event.created_at).isAfter(
              '2020-10-03T12:00:00.000Z'
            ),
            user: {
              login: event.user.login,
              url: event.user.html_url
            }
          };
        })
    )
    .then(prs => {
      // Ensure each repo only gets one request for their topics
      const repoTopicRequests = _.uniq(
        prs
          .filter(pr => pr.repo_must_have_topic)
          .reduce((repos, pr) => [...repos, pr.repo_name], [])
      ).map(fullRepo => {
        const [owner, repo] = fullRepo.split('/');
        return github.repos
          .getTopics({ owner, repo })
          .then(logCallsRemaining)
          .then(res => ({ repo: fullRepo, topics: res.data.names }));
      });

      return Promise.all(repoTopicRequests)
        .then(repoTopics =>
          repoTopics.reduce(
            (map, { repo, topics }) => ({ ...map, [repo]: topics }),
            {}
          )
        )
        .then(repoTopicMap =>
          prs.map(pr => ({
            ...pr,
            ...(pr.repo_must_have_topic
              ? {
                  repo_has_hacktoberfest_topic: repoTopicMap[pr.repo_name].some(
                    topic => topic.toLowerCase() === 'hacktoberfest'
                  )
                }
              : {})
          }))
        );
    })
    .then(prs =>
      prs.filter(
        pr => !pr.repo_must_have_topic || pr.repo_has_hacktoberfest_topic
      )
    )
    .then(prs => {
      const checkMergeStatus = _.map(prs, pr => {
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
    })
    .then(prs => {
      const checkApproval = _.map(prs, pr => {
        const repoDetails = pr.repo_name.split('/');
        const pullDetails = {
          owner: repoDetails[0],
          repo: repoDetails[1],
          number: pr.number
        };

        return github.pullRequests
          .getReviews(pullDetails)
          .then(logCallsRemaining)
          .then(res => res.data.some(review => review.state === 'APPROVED'));
      });

      return Promise.all(checkApproval).then(approvalStatus =>
        _.zipWith(prs, approvalStatus, (pr, approved) =>
          _.assign(pr, { approved })
        )
      );
    });
};

module.exports = findPrs;
