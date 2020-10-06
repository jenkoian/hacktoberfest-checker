import React from 'react';
import PropTypes from 'prop-types';

const PageWrapper = ({ children, ...props }) => (
  <div className="md:py-4 flex-grow flex-no-shrink" {...props}>
    <div className="md:py-4">{children}</div>
  </div>
);

PageWrapper.propTypes = {
  children: PropTypes.node,
};

export default PageWrapper;
