import React from 'react';

const SiteTitle = () => (
  <div className="text-center glowing-text">
    <a className="no-underline inline-block py-12 md:py-8 glowing-text" href="/">
      <h1 className="text-blue-700 text-4xl md:text-6xl glowing-text">
        Hacktober<span className="text-mid-purple">fest</span>
      </h1>
      <small className="block text-right -mt-4 mr-8 text-yellow text-base italic">
        Checker
      </small>
    </a>
  </div>
);

export default SiteTitle;
