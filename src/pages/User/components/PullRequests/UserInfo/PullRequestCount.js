import React from 'react';
import PropTypes from 'prop-types';
import pullRequestAmount from '../pullRequestAmount';

const PullRequestCount = ({ pullRequestCount }) => (
  <span className="block text-5xl light-mode:text-dark-grey font-medium w-64 self-center">
    <span className="text-light-pink">{pullRequestCount}</span> /{' '}
    {pullRequestAmount}
  </span>
);

PullRequestCount.propTypes = {
  pullRequestCount: PropTypes.number.isRequired,
};

export default PullRequestCount;
