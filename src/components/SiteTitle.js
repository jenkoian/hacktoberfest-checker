import React from 'react';

const SiteTitle = () => (
  <div className="text-center">
    <a className="no-underline inline-block py-12 md:py-8" href="/">
      <h1 className="text-hack-logo text-6xl md:text-7xl">
        hacktober
        <span className="block text-hack-alt-logo text-3xl md:text-5xl">
          fest
        </span>
      </h1>
      <small className="block text-hack-alt-fg light-mode:text-hack-dark-title uppercase">
        Checker
      </small>
    </a>
  </div>
);

export default SiteTitle;
