import React from 'react';
import PropTypes from 'prop-types';

const ErrorText = ({ errorMessage }) => (
  <h2 className="text-center text-white light-mode:text-dark-grey">
    {errorMessage}
  </h2>
);

ErrorText.propTypes = {
  errorMessage: PropTypes.string,
};

ErrorText.defaultProps = {
  errorMessage: "Couldn't find any data or we hit an error, err try again?",
};

export default ErrorText;
