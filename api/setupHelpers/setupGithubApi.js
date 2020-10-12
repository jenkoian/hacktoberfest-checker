'use strict';

const { Octokit } = require('@octokit/rest');

const setupGithubApi = () => {
  const github = new Octokit({
    baseUrl: process.env.GITHUB_API_BASE_URL
      ? process.env.GITHUB_API_BASE_URL
      : 'https://api.github.com',
    request: {
      timeout: 5000,
    },
    userAgent: 'Hacktoberfest Checker',
    auth: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN : '',
    log: 'console',
  });

  if (!process.env.GITHUB_TOKEN) {
    console.log('No GITHUB_TOKEN specified, do so to increase rate limit');
  }

  return github;
};

module.exports = setupGithubApi;
