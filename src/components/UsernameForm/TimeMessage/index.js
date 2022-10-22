import React from 'react';
import RemainTime from './getTimeMessage';

const TimeMessage = () => (
  <p className="text-center light-mode:text-hack-dark-title pb-2">
    <RemainTime />
  </p>
);

export default TimeMessage;
