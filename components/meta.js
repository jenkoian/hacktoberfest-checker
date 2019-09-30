import Head from 'next/head'

const Meta = () => (
  <Head>
    <title>Hacktoberfest Checker</title>
    <meta charSet="utf-8" />
    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Useful app to check how you're getting on in hacktoberfest" />
    <meta property="og:title" content="Hacktoberfest Checker" />
    <meta property="og:description" content="Useful app to check how you're getting on in hacktoberfest" />
    <link rel="canonical" href={process.env.NEXT_PUBLIC_REACT_APP_HOSTNAME} />
    <meta property="og:url" content={process.env.NEXT_PUBLIC_REACT_APP_HOSTNAME} />
    <meta property="og:site_name" content="Hacktoberfest Checker" />
    <meta property="og:image" content="/static/og.png" />
    <meta property="og:description" content="Check how you're doing in hacktoberfest" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:creator" content="@jenko" />
    <meta name="twitter:title" content="Hacktoberfest Checker" />
    <meta name="twitter:description" content="Check how you're doing in hacktoberfest" />
    <meta name="twitter:image" content="/static/og.png" />
    <meta name="theme-color" content="#202a6b" />
  </Head>
);

export default Meta;
