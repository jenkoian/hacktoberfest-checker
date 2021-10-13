export interface IGetPageLinksLink {
  link?: string;
  headers?: {
    link?: string;
  };
}

interface IHasNextPage {
  next?: string;
}

const getPageLinks = (link: IGetPageLinksLink): IHasNextPage => {
  const extractedLink: string = link.link || link.headers.link || '';

  const links: {
    [key: string]: string[];
  } = {};

  // link format:
  // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
  // @ts-ignore
  extractedLink.replace(
    /<([^>]*)>;\s*rel="([\w]*)"/g,
    (m: string, uri: string[], type: string) => {
      links[type] = uri;
    }
  );

  return links;
};

export default getPageLinks;
