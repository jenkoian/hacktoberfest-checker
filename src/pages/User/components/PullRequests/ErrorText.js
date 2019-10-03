import React from 'react';
import PropTypes from 'prop-types';
import Redirect from 'react-router/Redirect';

const ErrorText = ({ errorMessage }) => (
  <h2 className="text-center text-white" style={errorTextStyle}>
    {errorMessage}
  </h2>
);

ErrorText.propTypes = {
  errorMessage: PropTypes.string
};

ErrorText.defaultProps = {
  errorMessage: "Couldn't find any data or we hit an error, err try again?"
};

const errorTextStyle = {
  color: '#411E2F'
};

export default ErrorText;
