import React from 'react';
import loadingIcon from './loading-icon3.gif';

const LoadingIcon = () => (
  <div className="text-center rounded-full overflow-hidden">
    <img className="inline rounded-full h-24 w-24 object-cover" src={loadingIcon} width="120" height="120" alt="Loading icon" />
  </div>
);

export default LoadingIcon;
