import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MeContext } from 'context/Me';

const Me = () => {
  const { me } = useContext(MeContext);

  if (!me) {
    return <Navigate to="/" />;
  }

  return <Navigate to={`/user/${me}`} />;
};

export default Me;
