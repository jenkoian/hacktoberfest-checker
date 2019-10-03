import React from 'react';
import getTimeMessage from './getTimeMessage';

const TimeMessage = () => (
  <p className="text-center text-white pb-2" style={timeMessageStyle}>
    {getTimeMessage()}
  </p>
);

const timeMessageStyle = {
  color: '#411e2f'
};

export default TimeMessage;
