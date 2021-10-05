'use strict';

const _ = require('lodash');
const moment = require('moment');
const loadPrs = require('./loadPrs');

const findPrs = (gitlab, username) => {
  return loadPrs(gitlab, username)
    .then((pullRequestData) =>
      pullRequestData
        .filter((event) => {
          const isInvalid = event.labels.some((label) => {
            return (
              label.toLowerCase() === 'invalid' ||
              label.toLowerCase() === 'spam'
            );
          });

          return !isInvalid;
        })
        .map((event) => {
          const repo = event.web_url.substring(
            0,
            event.web_url.search('/-/merge_requests/')
          );

          const hacktoberFestLabels = _.some(
            event.labels,
            (label) => label.toLowerCase() === 'hacktoberfest-accepted'
          );

          const twoWeeksOld = moment.utc().subtract(14, 'days').startOf('day');

          return {
            has_hacktoberfest_label: hacktoberFestLabels,
            number: event.iid,
            open: event.state === 'opened',
            repo_id: event.project_id,
            repo_name: repo.replace('https://gitlab.com/', ''),
            repo_must_have_topic: moment
              .utc(event.created_at)
              .isAfter('2021-09-30T10:00:00.000Z'),
            title: event.title,
            url: event.web_url,
            created_at: moment.utc(event.created_at).format('MMMM Do YYYY'),
            is_pending: moment.utc(event.created_at).isAfter(twoWeeksOld),
            user: {
              login: event.author.username,
              url: event.author.web_url,
            },
          };
        })
    )
    .then((prs) => {
      // Ensure each repo only gets one request for their topics
      const repoTopicRequests = _.uniq(
        prs.filter((pr) => pr.repo_must_have_topic).map((pr) => pr.repo_id)
      ).map((repo_id) => {
        return gitlab.Projects.show(repo_id).then((res) => ({
          repo_id,
          topics: res.topics,
        }));
      });

      return Promise.all(repoTopicRequests)
        .then((repoTopics) =>
          _.reduce(
            repoTopics,
            (map, { repo_id, topics }) => ({
              ...map,
              [repo_id]: topics,
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
                    repo_has_hacktoberfest_topic: repoTopicMap[pr.repo_id].some(
                      (topic) => topic.toLowerCase() === 'hacktoberfest'
                    ),
                  }
                : {}
            )
          )
        );
    })
    .then((prs) => {
      return prs.filter((pr) => {
        // Operating under initial rules
        if (!pr.repo_must_have_topic) return true;
        // label OR topic
        return pr.has_hacktoberfest_label || pr.repo_has_hacktoberfest_topic;
      });
    })
    .then((prs) => {
      const checkMergeStatus = _.map(prs, (pr) => {
        return gitlab.MergeRequests.show(pr.repo_id, pr.number).then(
          (res) => res.state === 'merged'
        );
      });

      return Promise.all(checkMergeStatus).then((mergeStatus) =>
        _.zipWith(prs, mergeStatus, (pr, merged) => _.assign(pr, { merged }))
      );
    })
    .then((prs) => {
      const checkApproval = _.map(prs, (pr) => {
        return gitlab.MergeRequestApprovals.approvalState(
          pr.repo_id,
          pr.number
        ).then((res) => {
          if (!res.rules) {
            return [];
          }
          return res.rules.some((review) => review.approved === true);
        });
      });

      return Promise.all(checkApproval).then((approvalStatus) =>
        _.zipWith(prs, approvalStatus, (pr, approved) =>
          _.assign(pr, { approved })
        )
      );
    })
    .then((prs) => {
      return prs.filter((pr) => {
        // Operating under initial rules
        if (!pr.repo_must_have_topic) return true;
        // label OR (topic AND (merged OR approved))
        return (
          pr.has_hacktoberfest_label ||
          (pr.repo_has_hacktoberfest_topic && (pr.merged || pr.approved))
        );
      });
    });
};

module.exports = findPrs;
