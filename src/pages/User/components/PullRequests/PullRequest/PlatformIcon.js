import React from 'react';
import { useColorScheme } from 'use-color-scheme';
import PropTypes from 'prop-types';

import githubLogoLight from './github-logo-light.png';
import gitlabLogoLight from './gitlab-logo-light.png';
import githubLogoDark from './github-logo-dark.png';
import gitlabLogoDark from './gitlab-logo-dark.png';

const PlatformIcon = ({ isGitLab }) => {
  const { scheme } = useColorScheme();
  const lightScheme = scheme === 'light';
  const caseVariable = lightScheme + '-' + isGitLab;
  let displayIcon;
  switch (caseVariable) {
    case 'true-true':
      displayIcon = gitlabLogoDark;
      break;
    case 'true-false':
      displayIcon = githubLogoDark;
      break;
    case 'false-true':
      displayIcon = gitlabLogoLight;
      break;
    case 'false-false':
      displayIcon = githubLogoLight;
      break;
  }
  return (
    <div>
      <img
        className="inline rounded-full object-cover"
        src={displayIcon}
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
