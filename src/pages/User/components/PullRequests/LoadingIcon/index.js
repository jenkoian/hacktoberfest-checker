import React from 'react';
import loadingIcon from './loading-icon.gif';

const LoadingIcon = () => (
  <div className="text-center rounded-full overflow-hidden">
    <img className="inline rounded-full object-cover" src={loadingIcon} width="24" height="24" alt="Loading icon" />
  </div>
);

export default LoadingIcon;
