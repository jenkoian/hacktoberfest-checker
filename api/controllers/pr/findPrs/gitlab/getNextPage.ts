import hasNextPage from './hasNextPage';

const getNextPage = (
  pagination: any,
  gitlab: any,
  username: any,
  searchYear: any,
  pullRequestData: any
) =>
  new Promise((resolve: any, reject: any) => {
    gitlab.MergeRequests.all({
      scope: 'all',
      author_username: username,
      //created_after: `${searchYear}-08-30T00:00:00-12:00`,
      //created_before: `${searchYear}-10-31T23:59:59-12:00`,
      // 30 is the default but this makes it clearer/allows it to be tweaked
      per_page: pagination.perPage,
      page: pagination.next,
      showExpanded: true,
    })
      .then((res: any) => {
        const newPullRequestData = pullRequestData.concat(res.data);
        const pagination = res.paginationInfo;

        if (hasNextPage(pagination)) {
          getNextPage(
            pagination,
            gitlab,
            username,
            searchYear,
            newPullRequestData
          ).then((pullRequestData) => resolve(pullRequestData));
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
