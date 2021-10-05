import React from 'react';
import PropTypes from 'prop-types';
import getResultMessage from './getResultMessage';

const ResultMessage = ({ pullRequestCount }) => (
  <h3 className="my-1 font-light text-hack-fg light-mode:text-hack-dark-title">
    {getResultMessage(pullRequestCount)}
  </h3>
);

ResultMessage.propTypes = {
  pullRequestCount: PropTypes.number,
};

export default ResultMessage;
