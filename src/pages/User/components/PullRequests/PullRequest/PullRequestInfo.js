import React from 'react';
import PropTypes from 'prop-types';

function dateFormater(dateTime) {
  const date = new Date(dateTime);
  return date.toDateString();
}

const PullRequestInfo = ({ pullRequest }) => (
  <div>
    <div className="text-grey-darker">
      <a
        className="text-grey-darker font-semibold link no-underline hover:underline"
        href={pullRequest.user.url}
      >
        {pullRequest.user.login}
      </a>{' '}
      submitted a pull request{' '}
      <a
        className="text-orange link no-underline hover:underline"
        href={pullRequest.url}
      >
        {pullRequest.repository_url.split('repos/')[1]}#{pullRequest.number}
      </a>
    </div>
    <div className="text-grey-dark">
      {pullRequest.title} on {dateFormater(pullRequest.created_at)}
    </div>
  </div>
);

PullRequestInfo.propTypes = {
  pullRequest: PropTypes.shape({
    number: PropTypes.number.isRequired,
    // repo_name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    user: PropTypes.shape({
      login: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }).isRequired
  })
};

export default PullRequestInfo;
