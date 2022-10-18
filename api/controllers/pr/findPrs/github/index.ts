import _ from 'lodash';
import moment from 'moment';
import logCallsRemaining from '../../logCallsRemaining';
import loadPrs from './loadPrs';
import { Octokit } from '@octokit/rest';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types';

interface GithubPullRequestUpdatedData {
  has_hacktoberfest_label: boolean;
  number: number;
  open: boolean;
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

interface GithubPullRequestHacktoberfest extends GithubPullRequestUpdatedData {
  repo_has_hacktoberfest_topic?: boolean | undefined;
}

interface GithubPullRequestMerged extends GithubPullRequestHacktoberfest {
  merged: boolean;
}

export interface GithubPullRequestApproved extends GithubPullRequestMerged {
  approved: boolean;
}

export const findGithubPrs = async (github: Octokit, username: string) => {
  let pullRequestData: RestEndpointMethodTypes['search']['issuesAndPullRequests']['response']['data']['items'] = await loadPrs(
    github,
    username
  );
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
    const updatedPullRequestData: GithubPullRequestUpdatedData[] = pullRequestData.map(
      (event) => {
        const repo = event.pull_request.html_url.substring(
          0,
          event.pull_request.html_url.search('/pull/')
        );

        const hacktoberFestLabels = _.some(
          event.labels,
          (label) => label.name.toLowerCase() === 'hacktoberfest-accepted'
        );

        const weekOld = moment.utc().subtract(7, 'days').startOf('day');

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
          is_pending: moment.utc(event.created_at).isAfter(weekOld),
          user: {
            login: event.user.login,
            url: event.user.html_url,
          },
        };
      }
    );

    const repoTopicRequests = _.uniq(
      updatedPullRequestData
        .filter((pr) => pr.repo_must_have_topic)
        .map((pr) => pr.repo_name)
    ).map((repo_name) => {
      const [owner, repo] = repo_name.split('/');
      const repoDetails = { owner, repo };
      return github.repos
        .getAllTopics(repoDetails)
        .then(logCallsRemaining)
        .then(
          (
            res: RestEndpointMethodTypes['repos']['getAllTopics']['response']
          ) => ({ repo_name, topics: res.data.names })
        );
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

    const repoTopicsAfter: GithubPullRequestHacktoberfest[] = _.map(
      updatedPullRequestData,
      (pr) =>
        _.assign(
          pr,
          pr.repo_must_have_topic
            ? {
                repo_has_hacktoberfest_topic: repoTopicMap[pr.repo_name].some(
                  (topic: string) => topic.toLowerCase() === 'hacktoberfest'
                ) as boolean,
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
        const pullRequestMergedData: GithubPullRequestMerged[] = _.zipWith(
          pullRequests,
          mergeStatus,
          (pr, merged) => _.assign(pr, { merged })
        );

        const checkApproval = _.map(pullRequestMergedData, (pr) => {
          const repoDetails = pr.repo_name.split('/');
          const pullDetails = {
            owner: repoDetails[0],
            repo: repoDetails[1],
            pull_number: pr.number,
          };

          return github.pulls
            .listReviews(pullDetails)
            .then(logCallsRemaining)
            .then(
              (
                res: RestEndpointMethodTypes['pulls']['listReviews']['response']
              ) => res.data.some((review) => review.state === 'APPROVED')
            );
        });

        const approvalStatus = await Promise.all(checkApproval);
        const pullRequestApprovedData: GithubPullRequestApproved[] = _.zipWith(
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
      }
    }
  } else {
    return null;
  }
};

export const searchGithubUser = async (github: Octokit, username: string) => {
  const noUserFound = false;

  try {
    let user_data: RestEndpointMethodTypes['users']['getByUsername']['response'] = await github.users
      .getByUsername({ username })
      .then(logCallsRemaining);
    return user_data === null ? noUserFound : user_data;
  } catch (error: unknown) {
    return noUserFound;
  }
};
