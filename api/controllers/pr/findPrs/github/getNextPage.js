'use strict';

const getPageLinks = require('./getPageLinks');
const hasNextPage = require('./hasNextPage');

const getNextPage = async (response, github, pullRequestData) => {
  try {
    const baseUrl = process.env.GITHUB_API_BASE_URL
      ? process.env.GITHUB_API_BASE_URL
      : 'https://api.github.com';
    const nextPageLink = await getPageLinks(response).next.replace(baseUrl, '');

    const githubResults = await github.request('GET ' + nextPageLink);
    const newPullRequestData = pullRequestData.concat(githubResults.data.items);
    if (hasNextPage(githubResults)) {
      return await getNextPage(githubResults, github, newPullRequestData);
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Found ${pullRequestData.length} pull requests.`);
    }
    return newPullRequestData;
  } catch (error) {
    console.log('Error: ' + error);
    return error;
  }
};

module.exports = getNextPage;
