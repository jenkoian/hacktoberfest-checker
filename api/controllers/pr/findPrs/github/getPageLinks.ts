export interface GetPageLinksLink {
  link?: string;
  headers?: {
    link?: string;
  };
}

interface HasNextPage {
  next?: string;
}

const getPageLinks = (link: GetPageLinksLink): HasNextPage => {
  const extractedLink: string = link.link || link.headers.link || '';

  const links: {
    [key: string]: string[];
  } = {};

  // link format:
  // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
  extractedLink.replace(
    /<([^>]*)>;\s*rel="([\w]*)"/g,
    // @ts-ignore
    (m: string, uri: string[], type: string) => {
      links[type] = uri;
    }
  );

  return links;
};

export default getPageLinks;
