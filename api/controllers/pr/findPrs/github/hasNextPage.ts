import getPageLinks, { IGetPageLinksLink } from './getPageLinks';

const hasNextPage = (link: IGetPageLinksLink) => {
  return getPageLinks(link).next;
};

export default hasNextPage;
