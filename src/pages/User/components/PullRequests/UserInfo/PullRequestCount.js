import React from 'react';
import PropTypes from 'prop-types';
import pullRequestAmount from '../pullRequestAmount';

const PullRequestCount = ({ pullRequestCount }) => (
  <span className="block rounded text-5xl font-medium white w-64">
    {pullRequestCount} / {pullRequestAmount}
  </span>
);

PullRequestCount.propTypes = {
  pullRequestCount: PropTypes.number.isRequired
};

export default PullRequestCount;
