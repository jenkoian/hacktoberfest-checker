'use strict';

const hasNextPage = require('./hasNextPage');
const getNextPage = require('./getNextPage');

const buildQuery = (username, searchYear) => `+created:${searchYear}-09-30T00:00:00-12:00..${searchYear}-10-31T23:59:59-12:00+type:pr+is:public+draft:false+author:${username}`;

const loadPrs = async (github, username) => {
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

    const pullRequestData = githubPullRequest.data.items;
    if (hasNextPage(githubPullRequest)) {
      return await getNextPage(githubPullRequest, github, pullRequestData);
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Found ${pullRequestData.length} pull requests.`);
    }

    return pullRequestData;
  } catch (error) {
    console.log('Error: ' + Error);
    return error;
  }
}

module.exports = loadPrs;
