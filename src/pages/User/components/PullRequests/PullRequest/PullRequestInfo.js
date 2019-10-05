import React from 'react';
import PropTypes from 'prop-types';

const PullRequestInfo = ({ pullRequest }) => (
  <div>
    <div className="mb-4">
      <span className="text-light-blue">
        {pullRequest.repo_name}#{pullRequest.number}
      </span>
      {pullRequest.is_pending && <em className="text-mid-grey"> Pending</em>}
    </div>
    <div>
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
    user: PropTypes.shape({
      login: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }).isRequired
  })
};

export default PullRequestInfo;
