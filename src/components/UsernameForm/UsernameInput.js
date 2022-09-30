import React from 'react';
import PropTypes from 'prop-types';

const UsernameInput = ({ value, onChange, ...props }) => (
  <input
    className="bn bg-hack-alt-bg light-mode:bg-hack-alt-bg text-hack-fg placeholder-hack-fg light-mode:text-hack-fg light-mode:placeholder-hack-fg br--left mr-4 px-2 flex-auto"
    type="text"
    name="username"
    aria-label="GitHub/Gitlab username"
    placeholder="GitHub/Gitlab username"
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
