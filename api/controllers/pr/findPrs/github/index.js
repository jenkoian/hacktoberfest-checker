'use strict';

const _ = require('lodash');
const moment = require('moment');
const logCallsRemaining = require('../../logCallsRemaining');
const loadPrs = require('./loadPrs');

const findPrs = async (github, username) => {
  let pullRequestData = await loadPrs(github, username);
  if (pullRequestData) {
    pullRequestData = pullRequestData.filter((event) => {
      const isInvalid = event.labels.some((label) => {
        return (
          label.name.toLowerCase() === 'invalid' ||
          label.name.toLowerCase() === 'spam'
        );
      });

      return !isInvalid;
    });
  }

  if (pullRequestData) {
    pullRequestData = pullRequestData.map((event) => {
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
    });

    const repoTopicRequests = _.uniq(
      pullRequestData
        .filter((pr) => pr.repo_must_have_topic)
        .map((pr) => pr.repo_name)
    ).map((repo_name) => {
      const [owner, repo] = repo_name.split('/');
      const repoDetails = { owner, repo };
      return github.repos
        .getAllTopics(repoDetails)
        .then(logCallsRemaining)
        .then((res) => ({ repo_name, topics: res.data.names }));
    });

    const repoTopics = await Promise.all(repoTopicRequests);
    const repoTopicMap = _.reduce(
      repoTopics,
      (map, { repo_name, topics }) => ({
        ...map,
        [repo_name]: topics,
      }),
      {}
    );

    const repoTopicsAfter = _.map(pullRequestData, (pr) =>
      _.assign(
        pr,
        pr.repo_must_have_topic
          ? {
              repo_has_hacktoberfest_topic: repoTopicMap[pr.repo_name].some(
                (topic) => topic.toLowerCase() === 'hacktoberfest'
              ),
            }
          : {}
      )
    );

    if (repoTopicsAfter) {
      let pullRequests = repoTopicsAfter.filter((pr) => {
        // Operating under initial rules
        if (!pr.repo_must_have_topic) return true;
        // label OR topic
        return pr.has_hacktoberfest_label || pr.repo_has_hacktoberfest_topic;
      });

      if (pullRequests) {
        const checkMergeStatus = _.map(pullRequests, (pr) => {
          const repoDetails = pr.repo_name.split('/');
          const pullDetails = {
            owner: repoDetails[0],
            repo: repoDetails[1],
            pull_number: pr.number,
          };

          return github.pulls
            .checkIfMerged(pullDetails)
            .then(logCallsRemaining)
            .then((res) => {
              return res.status === 204;
            })
            .catch((err) => {
              // 404 means there wasn't a merge
              if (err.status === 404) {
                return false;
              }

              throw err;
            });
        });

        const mergeStatus = await Promise.all(checkMergeStatus);
        pullRequests = _.zipWith(pullRequests, mergeStatus, (pr, merged) =>
          _.assign(pr, { merged })
        );

        const checkApproval = _.map(pullRequests, (pr) => {
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

        const approvalStatus = await Promise.all(checkApproval);
        pullRequests = _.zipWith(pullRequests, approvalStatus, (pr, approved) =>
          _.assign(pr, { approved })
        );

        return pullRequests.filter((pr) => {
          // Operating under initial rules
          if (!pr.repo_must_have_topic) return true;
          // label OR (topic AND (merged OR approved))
          return (
            pr.has_hacktoberfest_label ||
            (pr.repo_has_hacktoberfest_topic && (pr.merged || pr.approved))
          );
        });
      }
    }
  } else {
    return null;
  }
};

const searchGithubUser = async (github, username) => {
  try {
    let user_data = await github.users
      .getByUsername({ username })
      .then(logCallsRemaining);
    return user_data;
  } catch (error) {
    return null;
  }
};
module.exports = [findPrs, searchGithubUser];
