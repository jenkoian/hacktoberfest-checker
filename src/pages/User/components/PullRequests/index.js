// Libraries
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// Hooks
import useFetchPullRequests from './hooks/useFetchPullRequests';

// Components
import LoadingIcon from './LoadingIcon';
import ErrorText from './ErrorText';
import pullRequestAmount from './pullRequestAmount';
import ShareButtons from './ShareButtons';
import UserInfo from './UserInfo';
import PullRequest from './PullRequest';
import IssuesLink from './IssuesLink';

export default function PullRequests({ username, condensed = false }) {
  const { loading, data, error } = useFetchPullRequests(username);

  useEffect(() => {
    if (localStorage.getItem('myGithub')) return;
    localStorage.setItem('myGithub', username);
  }, []);

  const getErrorMessage = () =>
    error?.error_description ??
    data?.error_description ??
    "Couldn't find any data or we hit an error, err try again?";

  if (loading) {
    return <LoadingIcon />;
  }

  if (error || data.error_description) {
    return <ErrorText errorMessage={getErrorMessage()} />;
  }

  const isComplete = data.prs.length >= pullRequestAmount;

  return (
    <>
      <div className="text-center text-hack-fg">
        {!condensed && (
          <ShareButtons
            username={username}
            pullRequestCount={data.prs.length}
          />
        )}
        <UserInfo
          username={username}
          userImage={data.userImage}
          pullRequestCount={data.prs.length}
        />
      </div>
      {!condensed && (
      <div className="w-5/6 mx-auto mb-4 lg:w-1/2">
          {data.prs.length > 0 &&
            data.prs.map((pullRequest, i) => (
              <PullRequest pullRequest={pullRequest} key={i} />
            ))}
        </div>
      )}
    </>
  );
}

PullRequests.propTypes = {
  username: PropTypes.string.isRequired,
  condensed: PropTypes.bool,
};
