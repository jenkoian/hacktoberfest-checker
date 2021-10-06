import React from 'react';
import PropTypes from 'prop-types';

const PullRequestInfo = ({ pullRequest }) => (
  <div>
    <div className="mb-4">
      <span className="text-hack-dark-title light-mode:text-hack-dark-title">
        {pullRequest.repo_name}#{pullRequest.number}
      </span>
      {pullRequest.is_pending && (
        <div className="ml-4 rounded-full px-2 text-hack-fg bg-hack-logo inline text-xs">
          <span>pending</span>
        </div>
      )}
    </div>
    <div className="text-hack-fg">
      {pullRequest.title} on {pullRequest.created_at}
    </div>
  </div>
);

PullRequestInfo.propTypes = {
  pullRequest: PropTypes.shape({
    number: PropTypes.number.isRequired,
    repo_name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    is_pending: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      login: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  }),
};

export default PullRequestInfo;
