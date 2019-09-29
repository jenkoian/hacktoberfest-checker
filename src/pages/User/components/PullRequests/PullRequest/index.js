import React from 'react';
import PropTypes from 'prop-types';
import MergeStatus from './MergeStatus';
import PullRequestInfo from './PullRequestInfo';

const PullRequest = ({ pullRequest }) => (
  <div
    className={`bg-white leading-normal ${
      pullRequest.has_hacktoberfest_label ? 'hacktoberfest' : ''
    }p-4 flex border-b border-grey break-words`}
  >
    <MergeStatus open={pullRequest.open} merged={pullRequest.merged} />
    <PullRequestInfo pullRequest={pullRequest} />
  </div>
);

PullRequest.propTypes = {
  pullRequest: PropTypes.shape({
    number: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      login: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default PullRequest;
