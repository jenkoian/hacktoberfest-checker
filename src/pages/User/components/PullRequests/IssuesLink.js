import React from 'react';

const IssuesLink = () => (
  <div className="w-4/5 mx-auto">
    <div className="text-mid-grey pb-4 text-center">
      Look at the following{' '}
      <a
        href="https://github.com/search?q=label:hacktoberfest+state:open+type:issue"
        className="text-mid-purple"
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
