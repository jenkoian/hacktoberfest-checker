'use strict';

const GithubApi = require('github');

const setupGithubApi = () => {
  const github = new GitHubApi({
    version: '3.0.0',
    debug: false,
    protocol: 'https',
    host: 'api.github.com',
    timeout: 5000,
    headers: {
      'user-agent': 'Hacktoberfest Checker'
    }
  });

  if (process.env.GITHUB_TOKEN) {
    github.authenticate({
      type: 'oauth',
      token: process.env.GITHUB_TOKEN
    });
  } else {
    console.log('No GITHUB_TOKEN specified, do so to increase rate limit');
  }

  return github;
};

module.exports = setupGithubApi;
