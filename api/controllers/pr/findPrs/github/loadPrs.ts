import hasNextPage from './hasNextPage';
import getNextPage from './getNextPage';

const buildQuery = (username: string, searchYear: number) =>
  `+created:${searchYear}-09-30T00:00:00-12:00..${searchYear}-10-31T23:59:59-12:00+type:pr+is:public+draft:false+author:${username}`;

const loadPrs = async (github: any, username: string) => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const searchYear = currentMonth < 9 ? currentYear - 1 : currentYear;
    const perPage = 100;

    const githubPullRequest = await github.search.issuesAndPullRequests({
      q: buildQuery(username, searchYear),
      // 30 is the default but this makes it clearer/allows it to be tweaked
      per_page: perPage,
    });
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
  } catch (error) {
    console.log('Error: ' + Error);
    return null;
  }
};

export default loadPrs;
