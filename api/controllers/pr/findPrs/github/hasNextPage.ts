import getPageLinks from './getPageLinks';

const hasNextPage = (link) => {
  return getPageLinks(link).next;
};

export default hasNextPage;
