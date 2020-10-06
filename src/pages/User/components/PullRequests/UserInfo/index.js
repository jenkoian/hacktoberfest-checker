import React from 'react';
import PropTypes from 'prop-types';
import UserImage from './UserImage';
import PullRequestCount from './PullRequestCount';
import ResultMessage from './ResultMessage';

const UserInfo = ({ username, userImage, pullRequestCount }) => (
  <div className="mb-6 flex flex-wrap justify-center content-center rounded mx-auto overflow-hidden w-5/6 lg:w-1/2">
    <div className="mx-4">
      {userImage && <UserImage userImage={userImage} username={username} />}
    </div>
    <div className="flex flex-wrap justify-center content-center flex-col">
      <PullRequestCount pullRequestCount={pullRequestCount} />
      <ResultMessage pullRequestCount={pullRequestCount} />
    </div>
  </div>
);

UserInfo.propTypes = {
  username: PropTypes.string.isRequired,
  userImage: PropTypes.string.isRequired,
  pullRequestCount: PropTypes.number.isRequired,
};

export default UserInfo;
