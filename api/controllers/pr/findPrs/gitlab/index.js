'use strict';

const _ = require('lodash');
const moment = require('moment');
const loadPrs = require('./loadPrs');

const findPrs = async (gitlab, username) => {
  let pullRequestData = await loadPrs(gitlab, username);
  pullRequestData = pullRequestData.filter((event) => {
    const isInvalid = event.labels.some((label) => {
      return (
        label.toLowerCase() === 'invalid' || label.toLowerCase() === 'spam'
      );
    });

    return !isInvalid;
  });

  pullRequestData = pullRequestData.map((event) => {
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
        .isAfter('2020-10-03T12:00:00.000Z'),
      title: event.title,
      url: event.web_url,
      created_at: moment.utc(event.created_at).format('MMMM Do YYYY'),
      is_pending: moment.utc(event.created_at).isAfter(twoWeeksOld),
      user: {
        login: event.author.username,
        url: event.author.web_url,
      },
    };
  });

  // Ensure each repo only gets one request for their topics
  const repoTopicRequests = _.uniq(
    pullRequestData
      .filter((pr) => pr.repo_must_have_topic)
      .map((pr) => pr.repo_id)
  ).map((repo_id) => {
    return gitlab.Projects.show(repo_id).then((res) => ({
      repo_id,
      topics: res.topics,
    }));
  });

  const repoTopics = await Promise.all(repoTopicRequests);
  const repoTopicMap = _.reduce(
    repoTopics,
    (map, { repo_id, topics }) => ({
      ...map,
      [repo_id]: topics,
    }),
    {}
  );

  const repoTopicsAfter = _.map(pullRequestData, (pr) =>
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
  );

  let pullRequests = repoTopicsAfter.filter((pr) => {
    // Operating under initial rules
    if (!pr.repo_must_have_topic) return true;
    // label OR topic
    return pr.has_hacktoberfest_label || pr.repo_has_hacktoberfest_topic;
  });

  const checkMergeStatus = _.map(pullRequests, (pr) => {
    return gitlab.MergeRequests.show(pr.repo_id, pr.number).then(
      (res) => res.state === 'merged'
    );
  });

  const mergeStatus = await Promise.all(checkMergeStatus);
  pullRequests = _.zipWith(pullRequests, mergeStatus, (pr, merged) =>
    _.assign(pr, { merged })
  );

  const checkApproval = _.map(pullRequests, (pr) => {
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
};

const searchGitlabUser = async (gitlab, username) => {
  try {
    let user_data = await gitlab.Users.search(username);
    return user_data;
    // return null;
  } catch (error) {
    return null;
  }
};
module.exports = [findPrs, searchGitlabUser];
