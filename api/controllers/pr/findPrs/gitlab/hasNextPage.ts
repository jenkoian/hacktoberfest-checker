import { PaginationResponse } from '@gitbeaker/core/dist/types/infrastructure/RequestHelper';

const hasNextPage = (pagination: PaginationResponse['paginationInfo']) => {
  return pagination.next;
};

export default hasNextPage;
