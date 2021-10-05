import React from 'react';
import PropTypes from 'prop-types';
import githubLogo from './github-logo.png';
import gitlabLogo from './gitlab-logo.png';

const PlatformIcon = ({ isGitLab }) => {
  const resolvedIcon = isGitLab ? gitlabLogo : githubLogo;
  return (
    <div>
      <img
        className="inline rounded-full object-cover"
        src={resolvedIcon}
        width="24"
        height="24"
        alt="Loading icon"
      />
    </div>
  );
};

PlatformIcon.propTypes = {
  isGitLab: PropTypes.bool.isRequired,
};

export default PlatformIcon;
