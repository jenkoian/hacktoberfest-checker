import React from 'react';
import PropTypes from 'prop-types';

const UsernameInput = ({ value, onChange, ...props }) => (
  <input
    className="bn br--left rounded-l-sm px-2 flex-auto"
    type="text"
    name="username"
    aria-label="GitHub username"
    placeholder="GitHub username"
    value={value}
    onChange={onChange}
    spellCheck="false"
    autoCapitalize="none"
    autoCorrect="off"
    style={inputStyle}
  />
);

UsernameInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

const inputStyle = {
  borderRight: '2px solid #133370'
};

export default UsernameInput;
