import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';

const NotFound = () => (
  <Fragment>
    <Helmet>
      <title>Page not found</title>
    </Helmet>
    <h1>404</h1>
  </Fragment>
);

export default NotFound;
