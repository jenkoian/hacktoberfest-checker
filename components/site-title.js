import React from 'react';

const SiteTitle = props => (
    <h1 className="text-center text-4xl md:text-6xl py-12 md:py-8">
        <a className="text-white no-underline" href="">
            {props.children}
        </a>
    </h1>
);

export default SiteTitle;
