import React from 'react';
import PropTypes from 'prop-types';
import getResultMessage from './getResultMessage';

const ResultMessage = ({ pullRequestCount }) => (
  <h3 className="my-1 font-light text-gray-light light-mode:text-dark-grey">
    {getResultMessage(pullRequestCount)}
  </h3>
);

ResultMessage.propTypes = {
  pullRequestCount: PropTypes.number,
};

export default ResultMessage;
