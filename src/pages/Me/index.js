import React from 'react';
import { Redirect } from 'react-router-dom';

const Me = () => {
  const username = localStorage.getItem('myGithub');

  if (!username) {
    return <Redirect to="/" />;
  }

  return <Redirect to={`/user/${username}`} />;
};

export default Me;
