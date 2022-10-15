import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { MeContext } from 'context/Me';

const Navbar = () => {
  const { me } = useContext(MeContext);

  const isMeActive = (match, location) => {
    const pathname = location.pathname;
    return pathname === '/me' || pathname === `/user/${me}`;
  };

  const isUserActive = (match, location) => {
    const pathname = location.pathname;
    return (
      pathname === '/' ||
      (pathname.startsWith('/user/') && !isMeActive(match, location))
    );
  };

  return (
    <>
      <nav className="text-center pb-4 nav">
        {me && (
          <NavLink
            to="/me"
            isActive={isMeActive}
            className="p-2 border-b-2 border-transparent hover:border-hack-alt-logo light-mode:text-hack-dark-title light-mode:hover:text-hack-dark-title"
            activeClassName="border-hack-logo"
          >
            Me
          </NavLink>
        )}
        <NavLink
          to="/"
          isActive={isUserActive}
          className="p-2 border-b-2 border-transparent hover:border-hack-alt-logo light-mode:text-hack-dark-title light-mode:hover:text-hack-dark-title"
          activeClassName="border-hack-logo"
        >
          User
        </NavLink>
        <NavLink
          to="/friends"
          className="p-2 border-b-2 border-transparent hover:border-hack-alt-logo light-mode:text-hack-dark-title light-mode:hover:text-hack-dark-title "
          activeClassName="border-hack-logo"
        >
          Compare with friends
        </NavLink>
      </nav>
    </>
  );
};

export default Navbar;
