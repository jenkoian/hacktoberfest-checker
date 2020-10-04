import React from 'react';
import PropTypes from 'prop-types';

const PullRequestInfo = ({ pullRequest }) => (
  <span>
    <div className="mb-4">
      <span className="text-light-blue">
        {pullRequest.repo_name}#{pullRequest.number}
      </span>
      {pullRequest.is_pending && (
        <div className="rounded-full text-white bg-mid-blue inline ml-2 px-2 text-xs">
          <span>Pending</span>
        </div>
       )}
    </div>
    <div>
      {pullRequest.title} on {pullRequest.created_at}
    </div>
  </span>
);

PullRequestInfo.propTypes = {
  pullRequest: PropTypes.shape({
    number: PropTypes.number.isRequired,
    repo_name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      login: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }).isRequired
  })
};

export default PullRequestInfo;
