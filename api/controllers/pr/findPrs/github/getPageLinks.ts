const getPageLinks = (link: any) => {
  link = link.link || link.headers.link || '';

  const links: any = {};

  // link format:
  // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
  link.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m: any, uri: any, type: any) => {
    links[type] = uri;
  });

  return links;
};

export default getPageLinks;
