import { Gitlab } from '@gitbeaker/node';

const setupGitlabApi = () => {
  const gitlab = new Gitlab({
    host: process.env.GITLAB_API_HOST
      ? process.env.GITLAB_API_HOST
      : 'https://gitlab.com',
    requestTimeout: 5000,
    token: process.env.GITLAB_TOKEN ? process.env.GITLAB_TOKEN : '',
  });

  if (!process.env.GITLAB_TOKEN) {
    console.log('No GITLAB_TOKEN specified, do so to increase rate limit');
  }

  return gitlab;
};

export default setupGitlabApi;
