import getPageLinks from './getPageLinks';

const hasNextPage = (link: any) => {
  return getPageLinks(link).next;
};

export default hasNextPage;
