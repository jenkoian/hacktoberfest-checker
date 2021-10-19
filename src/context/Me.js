import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MeContext = React.createContext();

const MeContextProvider = ({ children }) => {
  const [me, setMeState] = useState(localStorage.getItem('myGithub'));

  const setMe = (myAccount) => {
    localStorage.setItem('myGithub', myAccount);
    setMeState(myAccount);
  };

  return (
    <MeContext.Provider value={{ me, setMe }}>{children}</MeContext.Provider>
  );
};

MeContextProvider.propTypes = {
  children: PropTypes.node,
};

export { MeContext, MeContextProvider };
