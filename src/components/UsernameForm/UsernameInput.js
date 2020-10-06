import React from 'react';
import PropTypes from 'prop-types';

const UsernameInput = ({ value, onChange, ...props }) => (
  <input
    className="bn bg-dark-blue-alt light-mode:bg-light-grey text-white light-mode:text-dark-grey light-mode:placeholder-soft-blue br--left mr-4 px-2 flex-auto"
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
  onChange: PropTypes.func,
};

export default UsernameInput;
