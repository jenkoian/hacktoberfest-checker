import getPageLinks from './getPageLinks';
import hasNextPage from './hasNextPage';

const getNextPage = (response: any, github: any, pullRequestData: any) =>
  new Promise((resolve, reject) => {
    const baseUrl = process.env.GITHUB_API_BASE_URL
      ? process.env.GITHUB_API_BASE_URL
      : 'https://api.github.com';
    const nextPageLink = getPageLinks(response).next.replace(baseUrl, '');

    github
      .request('GET ' + nextPageLink)
      .then((res: any) => {
        const newPullRequestData = pullRequestData.concat(res.data.items);

        if (hasNextPage(res)) {
          getNextPage(res, github, newPullRequestData).then((pullRequestData) =>
            resolve(pullRequestData)
          );
          return;
        }

        if (process.env.NODE_ENV !== 'production') {
          console.log(`Found ${pullRequestData.length} pull requests.`);
        }
        resolve(newPullRequestData);
      })
      .catch((err: any) => {
        console.log('Error: ' + err);
        return reject();
      });
  });

export default getNextPage;
