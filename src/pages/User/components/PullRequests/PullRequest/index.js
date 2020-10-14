import React from 'react';
import PropTypes from 'prop-types';
import MergeStatus from './MergeStatus';
import PullRequestInfo from './PullRequestInfo';

const PullRequest = ({ pullRequest }) => (
  <a className="pull-request shadow-lg" href={pullRequest.url}>
    <div
      className={`flex text-mid-grey light-mode:text-dark-grey mb-6 ${
        pullRequest.has_hacktoberfest_label ? 'hacktoberfest ' : ''
      }p-4 break-all`}
    >
      <MergeStatus open={pullRequest.open} merged={pullRequest.merged} />
      <PullRequestInfo pullRequest={pullRequest} />
    </div>
  </a>
);

PullRequest.propTypes = {
  pullRequest: PropTypes.shape({
    number: PropTypes.number.isRequired,
    repo_name: PropTypes.string.isRequired,
    repo_must_have_topic: PropTypes.bool.isRequired,
    repo_has_hacktoberfest_topic: PropTypes.bool,
    title: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    is_pending: PropTypes.bool.isRequired,
    has_hacktoberfest_label: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    merged: PropTypes.bool.isRequired,
    approved: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      login: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default PullRequest;
