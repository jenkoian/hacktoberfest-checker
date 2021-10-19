import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { MeContext } from 'context/Me';

const Me = () => {
  const { me } = useContext(MeContext);

  if (!me) {
    return <Redirect to="/" />;
  }

  return <Redirect to={`/user/${me}`} />;
};

export default Me;
