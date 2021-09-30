'use strict';

const hasNextPage = require('./hasNextPage');
const getNextPage = require('./getNextPage');

const buildQuery = (username, searchYear) =>
  `+created:${searchYear}-09-30T00:00:00-12:00..${searchYear}-10-31T23:59:59-12:00+type:pr+is:public+draft:false+author:${username}`;

const loadPrs = (github, username) =>
  new Promise((resolve, reject) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const searchYear = currentMonth < 9 ? currentYear - 1 : currentYear;
    const perPage = 100;

    github.search
      .issuesAndPullRequests({
        q: buildQuery(username, searchYear),
        // 30 is the default but this makes it clearer/allows it to be tweaked
        per_page: perPage,
      })
      .then((res) => {
        const pullRequestData = res.data.items;
        if (hasNextPage(res)) {
          getNextPage(res, github, pullRequestData).then((pullRequestData) =>
            resolve(pullRequestData)
          );
          return;
        }

        if (process.env.NODE_ENV !== 'production') {
          console.log(`Found ${pullRequestData.length} pull requests.`);
        }
        resolve(pullRequestData);
      })
      .catch((err) => {
        console.log('Error: ' + err);
        return reject();
      });
  });

module.exports = loadPrs;
