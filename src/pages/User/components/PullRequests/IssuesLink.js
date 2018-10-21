import React from 'react';

const IssuesLink = () => (
    <div className="flex flex-wrap justify-center content-center">
        <div className="text-grey-light pb-4">
            Look at the following{' '}
            <a
                href="https://github.com/search?q=label:hacktoberfest+state:open+type:issue"
                className="text-orange"
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
