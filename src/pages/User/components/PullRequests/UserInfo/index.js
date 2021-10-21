import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import UserImage from './UserImage';
import PullRequestCount from './PullRequestCount';
import ResultMessage from './ResultMessage';
import { MeContext } from 'context/Me';

const UserInfo = ({
  username,
  userImage,
  pullRequestCount,
  showUsernameLink = false,
}) => {
  const { me } = useContext(MeContext);

  return (
    <>
      {showUsernameLink && (
        <div className="mt-8 text-hack-logo">
          {username === me && (
            <span
              className="text-2xl inline-block mr-2 -mt-2 align-middle"
              title="This is me"
            >
              ★
            </span>
          )}
          <a href={`/user/${username}`}>{username}</a>
        </div>
      )}
      <div className="mb-6 flex flex-wrap justify-center content-center rounded mx-auto overflow-hidden w-5/6 lg:w-1/2">
        <div className="mx-4">
          {userImage && <UserImage userImage={userImage} username={username} />}
        </div>
        <div className="flex flex-wrap justify-center content-center flex-col">
          <PullRequestCount pullRequestCount={pullRequestCount} />
          <ResultMessage pullRequestCount={pullRequestCount} />
        </div>
      </div>
    </>
  );
};

UserInfo.propTypes = {
  username: PropTypes.string.isRequired,
  userImage: PropTypes.string.isRequired,
  pullRequestCount: PropTypes.number.isRequired,
  showUsernameLink: PropTypes.bool,
};

export default UserInfo;
