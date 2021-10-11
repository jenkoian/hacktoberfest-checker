import React from 'react';
import { Helmet } from 'react-helmet';

const NotFound = () => (
  <>
    <Helmet>
      <title>Page not found</title>
    </Helmet>
    <h2 className="py-20 text-5xl text-center md:text-xxl text-hack-fg light-mode:text-hack-dark-title">
      Oops!
    </h2>
    <p className="py-4 text-center text-hack-fg light-mode:text-hack-dark-title">
      The page you are looking for does not exist.
    </p>
    <p className="text-center">
      <a className="text-hack-logo" href="/">
        Return to homepage
      </a>
    </p>
  </>
);

export default NotFound;
