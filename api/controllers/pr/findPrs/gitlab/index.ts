import _ from 'lodash';
import moment from 'moment';
import loadPrs from './loadPrs';
import { Resources } from '@gitbeaker/core';

interface GitlabPullRequestUpdatedData {
  has_hacktoberfest_label: boolean;
  number: number;
  open: boolean;
  repo_id: number;
  repo_name: string;
  repo_must_have_topic: boolean;
  title: string;
  url: string;
  created_at: string;
  is_pending: boolean;
  user: {
    login: string;
    url: string;
  };
}

interface GitlabPullRequestHacktoberfest extends GitlabPullRequestUpdatedData {
  repo_has_hacktoberfest_topic?: boolean | undefined;
}

interface GitlabPullRequestMerged extends GitlabPullRequestHacktoberfest {
  merged: boolean;
}

export interface GitlabPullRequestApproved extends GitlabPullRequestMerged {
  approved: boolean;
}

interface ApprovalRule {
  approved: boolean;
}

interface ApprovalState {
  rules: ApprovalRule[];
}

export const findGitlabPrs = async (
  gitlab: Resources.Gitlab,
  username: string
) => {
  let pullRequestData = await loadPrs(gitlab, username);
  // Remove invalid pull requests
  pullRequestData = pullRequestData.filter((event) => {
    const isInvalid = event.labels.some((label) => {
      return (
        label.toLowerCase() === 'invalid' || label.toLowerCase() === 'spam'
      );
    });

    return !isInvalid;
  });

  const updatedPullRequestData: GitlabPullRequestUpdatedData[] = pullRequestData.map(
    (event) => {
      const repo = event.web_url.substring(
        0,
        event.web_url.search('/-/merge_requests/')
      );

      const hacktoberFestLabels = _.some(
        event.labels,
        (label) => label.toLowerCase() === 'hacktoberfest-accepted'
      );

      const weekOld = moment.utc().subtract(7, 'days').startOf('day');

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
        is_pending: moment.utc(event.created_at).isAfter(weekOld),
        user: {
          login: event.author.username as string,
          url: event.author.web_url as string,
        },
      };
    }
  );

  // Ensure each repo only gets one request for their topics
  const repoTopicRequests = _.uniq(
    updatedPullRequestData
      .filter((pr) => pr.repo_must_have_topic)
      .map((pr) => pr.repo_id)
  ).map((repo_id: number) => {
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

  const repoTopicsAfter: GitlabPullRequestHacktoberfest[] = _.map(
    updatedPullRequestData,
    (pr) =>
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

  const pullRequests = repoTopicsAfter.filter((pr) => {
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
  const pullRequestMergedData: GitlabPullRequestMerged[] = _.zipWith(
    pullRequests,
    mergeStatus,
    (pr, merged) => _.assign(pr, { merged })
  );

  const checkApproval = _.map(pullRequestMergedData, (pr) => {
    return gitlab.MergeRequestApprovals.approvalState(
      pr.repo_id,
      pr.number
    ).then((res) => {
      const response = (res as unknown) as ApprovalState;
      if (!response.rules) {
        return [];
      }
      return response.rules.some((review) => review.approved === true);
    });
  }) as Promise<boolean>[];

  const approvalStatus = await Promise.all(checkApproval);
  const pullRequestApprovedData: GitlabPullRequestApproved[] = _.zipWith(
    pullRequestMergedData,
    approvalStatus,
    (pr, approved) => _.assign(pr, { approved })
  );

  return pullRequestApprovedData.filter((pr) => {
    // Operating under initial rules
    if (!pr.repo_must_have_topic) return true;
    // label OR (topic AND (merged OR approved))
    return (
      pr.has_hacktoberfest_label ||
      (pr.repo_has_hacktoberfest_topic && (pr.merged || pr.approved))
    );
  });
};

export const searchGitlabUser = async (
  gitlab: Resources.Gitlab,
  username: string
) => {
  const noUserFound = false;

  try {
    const user_data = await gitlab.Users.username(username);
    return user_data === null ? noUserFound : user_data;
  } catch (error: unknown) {
    return noUserFound;
  }
};
