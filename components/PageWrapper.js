import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Meta from './meta';
import '../src/tailwind.css';
import '../src/index.css';
import '../src/GithubCorner.css';

const PageWrapper = ({ children, ...props }) => (
  <Fragment>
    <Meta />
    <div className="md:py-4 flex-grow flex-no-shrink" {...props}>
      <div className="md:py-4">{children}</div>
    </div>
  </Fragment>
);

PageWrapper.propTypes = {
  children: PropTypes.node
};

export default PageWrapper;
