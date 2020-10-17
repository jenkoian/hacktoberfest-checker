import React from 'react';

const SiteTitle = () => (
  <div className="text-center">
    <a className="no-underline inline-block py-12 md:py-8" href="/">
      <h1 className="text-dark-pink text-6xl md:text-7xl">
        Hacktober
        <span className="text-light-pink text-3xl md:text-5xl uppercase block">
          fest
        </span>
      </h1>
      <small className="block text-light-blue light-mode:text-dark-blue uppercase block">
        Checker
      </small>
    </a>
  </div>
);

export default SiteTitle;
