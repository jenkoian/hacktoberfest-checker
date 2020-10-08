import React from 'react';
import getTimeMessage from './getTimeMessage';

const TimeMessage = () => (
  <p className="text-center light-mode:text-dark-grey pb-2">
    {getTimeMessage()}
  </p>
);

export default TimeMessage;
