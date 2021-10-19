import { PaginationResponse } from '@gitbeaker/core/dist/types/infrastructure/RequestHelper';
import { MergeRequestSchema } from '@gitbeaker/core/dist/types/resources/MergeRequests';
import { Resources } from '@gitbeaker/core';
import hasNextPage from './hasNextPage';

const getNextPage = async (
  pagination: PaginationResponse['paginationInfo'],
  gitlab: Resources.Gitlab,
  username: string,
  searchYear: number,
  pullRequestData: MergeRequestSchema[]
) => {
  try {
    const mergeRequestResults = ((await gitlab.MergeRequests.all({
      scope: 'all',
      author_username: username,
      created_after: `${searchYear}-09-30T00:00:00-12:00`,
      created_before: `${searchYear}-10-31T23:59:59-12:00`,
      // 30 is the default but this makes it clearer/allows it to be tweaked
      per_page: pagination.perPage,
      page: pagination.next,
      showExpanded: true,
    })) as unknown) as PaginationResponse<MergeRequestSchema[]>;

    const newPullRequestData = pullRequestData.concat(mergeRequestResults.data);
    pagination = mergeRequestResults.paginationInfo;

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
  } catch (error: unknown) {
    console.log('Error: ' + error);
    return error;
  }
};

export default getNextPage;
