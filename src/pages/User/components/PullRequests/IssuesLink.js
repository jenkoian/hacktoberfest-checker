import React from 'react';

const IssuesLink = () => (
  <div className="flex flex-wrap justify-center content-center text-center">
    <div className="text-hack-fg light-mode:text-hack-dark-title pb-4">
      Look at the following{' '}
      <a
        href="https://github.com/search?q=label:hacktoberfest+state:open+type:issue"
        target="_blank"
        rel="noopener noreferrer"
      >
        issues
      </a>{' '}
      and get hacking!
    </div>
  </div>
);

export default IssuesLink;
