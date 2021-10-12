import hasNextPage from './hasNextPage';
import getNextPage from './getNextPage';
import { Octokit } from '@octokit/rest';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types';

const buildQuery = (username: string, searchYear: number) =>
  `+created:${searchYear}-09-30T00:00:00-12:00..${searchYear}-10-31T23:59:59-12:00+type:pr+is:public+draft:false+author:${username}`;

const loadPrs = async (
  github: Octokit,
  username: string
): Promise<
  RestEndpointMethodTypes['search']['issuesAndPullRequests']['response']['data']['items']
> => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const searchYear = currentMonth < 9 ? currentYear - 1 : currentYear;
    const perPage = 100;

    const githubPullRequest: RestEndpointMethodTypes['search']['issuesAndPullRequests']['response'] = await github.search.issuesAndPullRequests(
      {
        q: buildQuery(username, searchYear),
        // 30 is the default but this makes it clearer/allows it to be tweaked
        per_page: perPage,
      }
    );
    if (githubPullRequest) {
      const pullRequestData = githubPullRequest.data.items;
      if (hasNextPage(githubPullRequest)) {
        return await getNextPage(githubPullRequest, github, pullRequestData);
      }

      if (process.env.NODE_ENV !== 'production') {
        if (pullRequestData) {
          console.log(`Found ${pullRequestData.length} pull requests.`);
        }
      }

      return pullRequestData;
    }
  } catch (error: unknown) {
    console.log('Error: ' + Error);
    return null;
  }
};

export default loadPrs;
