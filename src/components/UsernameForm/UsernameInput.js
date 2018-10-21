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
  />
);

UsernameInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default UsernameInput;
