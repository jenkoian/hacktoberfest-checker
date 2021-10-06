import hasNextPage from './hasNextPage';
import getNextPage from './getNextPage';

const loadPrs = async (gitlab, username) => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const searchYear = currentMonth < 9 ? currentYear - 1 : currentYear;
    const perPage = 100;

    const mergeRequestResults = await gitlab.MergeRequests.all({
      scope: 'all',
      author_username: username,
      created_after: `${searchYear}-09-30T00:00:00-12:00`,
      created_before: `${searchYear}-10-31T23:59:59-12:00`,
      // 30 is the default but this makes it clearer/allows it to be tweaked
      per_page: perPage,
      showExpanded: true,
    });

    const pullRequestData = mergeRequestResults.data || mergeRequestResults;
    const pagination = mergeRequestResults.paginationInfo;
    if (pagination && hasNextPage(pagination)) {
      return await getNextPage(
        pagination,
        gitlab,
        username,
        searchYear,
        pullRequestData
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Found ${pullRequestData.length} pull requests.`);
    }

    return pullRequestData;
  } catch (error) {
    console.log('Error: ' + err);
  }
};

export default loadPrs;
