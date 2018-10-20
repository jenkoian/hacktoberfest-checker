'use strict';

const getNextPage = (response, github, pullRequestData) =>
  new Promise((resolve, reject) => {
    github.getNextPage(response, (err, res) => {
      if (err) {
        return reject();
      }

      const newPullRequestData = pullRequestData.concat(res.data.items);

      if (github.hasNextPage(res)) {
        getNextPage(res, github, newPullRequestData).then(pullRequestData =>
          resolve(pullRequestData)
        );
        return;
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log(`Found ${pullRequestData.length} pull requests.`);
      }
      resolve(newPullRequestData);
    });
  });

module.exports = getNextPage;
