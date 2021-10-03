import hasNextPage from './hasNextPage';
import getNextPage from './getNextPage';

const loadPrs = (gitlab: any, username: string) =>
  new Promise((resolve, reject) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const searchYear = currentMonth < 9 ? currentYear - 1 : currentYear;
    const perPage = 100;

    gitlab.MergeRequests.all({
      scope: 'all',
      author_username: username,
      created_after: `${searchYear}-09-30T00:00:00-12:00`,
      created_before: `${searchYear}-10-31T23:59:59-12:00`,
      // 30 is the default but this makes it clearer/allows it to be tweaked
      per_page: perPage,
      showExpanded: true,
    })
      .then((res: any) => {
        const pullRequestData = res.data || res;
        const pagination = res.paginationInfo;
        if (pagination && hasNextPage(pagination)) {
          getNextPage(
            pagination,
            gitlab,
            username,
            searchYear,
            pullRequestData
          ).then((pullRequestData) => resolve(pullRequestData));
          return;
        }

        if (process.env.NODE_ENV !== 'production') {
          console.log(`Found ${pullRequestData.length} pull requests.`);
        }

        resolve(pullRequestData);
      })
      .catch((err: any) => {
        console.log('Error: ' + err);
        return reject();
      });
  });

export default loadPrs;
