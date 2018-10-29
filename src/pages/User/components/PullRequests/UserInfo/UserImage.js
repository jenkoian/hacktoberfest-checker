import React from 'react';
import PropTypes from 'prop-types';

const UserImage = ({ userImage, username }) => (
  <a
    href={`https://github.com/${username}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      id="userImage"
      alt={`GitHub profile image for ${username}`}
      className="text-center rounded-full w-32 h-32 border-4 border-solid border-white bg-white overflow-hidden dim"
      src={userImage}
    />
  </a>
);

UserImage.propTypes = {
  username: PropTypes.string.isRequired,
  userImage: PropTypes.string.isRequired
};

export default UserImage;
