import getPageLinks, { GetPageLinksLink } from './getPageLinks';

const hasNextPage = (link: GetPageLinksLink) => {
  return getPageLinks(link).next;
};

export default hasNextPage;
