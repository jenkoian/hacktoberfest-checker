import hasNextPage from './hasNextPage';

const getNextPage = async (
  pagination,
  gitlab,
  username,
  searchYear,
  pullRequestData
) => {
  try {
    const mergeRequestResults = await gitlab.MergeRequests.all({
      scope: 'all',
      author_username: username,
      //created_after: `${searchYear}-08-30T00:00:00-12:00`,
      //created_before: `${searchYear}-10-31T23:59:59-12:00`,
      // 30 is the default but this makes it clearer/allows it to be tweaked
      per_page: pagination.perPage,
      page: pagination.next,
      showExpanded: true,
    });

    const newPullRequestData = pullRequestData.concat(mergeRequestResults.data);
    const pagination = mergeRequestResults.paginationInfo;

    if (hasNextPage(pagination)) {
      return await getNextPage(
        pagination,
        gitlab,
        username,
        searchYear,
        newPullRequestData
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Found ${pullRequestData.length} pull requests.`);
    }

    return pullRequestData;
  } catch (error) {
    console.log('Error: ' + error);
    return error;
  }
};

export default getNextPage;
