import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const username = localStorage.getItem('myGithub');

  const isMeActive = (match, location) => {
    const pathname = location.pathname;
    return pathname === '/me' || pathname === `/user/${username}`;
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
      <nav className="text-center pb-4">
        {username && (
          <NavLink
            to="/me"
            isActive={isMeActive}
            className="p-2 border-b-2 border-transparent hover:border-hack-alt-logo"
            activeClassName="border-hack-logo"
          >
            Me
          </NavLink>
        )}
        <NavLink
          to="/"
          isActive={isUserActive}
          className="p-2 border-b-2 border-transparent hover:border-hack-alt-logo"
          activeClassName="border-hack-logo"
        >
          User
        </NavLink>
        <NavLink
          to="/team"
          className="p-2 border-b-2 border-transparent hover:border-hack-alt-logo"
          activeClassName="border-hack-logo"
        >
          Team
        </NavLink>
      </nav>
    </>
  );
};

export default Navbar;
