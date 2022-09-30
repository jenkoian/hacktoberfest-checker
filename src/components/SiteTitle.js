import React from 'react';

const SiteTitle = () => (
  <div className="text-center">
    <a className="no-underline inline-block py-12 md:py-8" href="/">
      <h1 className="text-hack-logo light-mode:text-hack-dark-title text-5xl md:text-7xl">
        hack
        <span className="block">tober</span>
        <span className="block">fest</span>
      </h1>
      <small className="block text-hack-alt-fg light-mode:text-hack-dark-title font-semibold m-5 uppercase">
        Checker
      </small>
    </a>
  </div>
);

export default SiteTitle;
