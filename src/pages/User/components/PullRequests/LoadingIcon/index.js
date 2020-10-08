import React from 'react';
import { useColorScheme } from 'use-color-scheme';

import loadingIcon from './loading-icon.gif';
import loadingIconDark from './loading-icon-dark.gif';

const LoadingIcon = () => {
  const { scheme } = useColorScheme();
  const resolvedIcon = scheme === 'light' ? loadingIconDark : loadingIcon;

  return (
    <div className="text-center rounded-full overflow-hidden">
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

export default LoadingIcon;
