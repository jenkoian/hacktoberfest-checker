import React, {Fragment} from 'react';
import {Helmet} from 'react-helmet';

const NotFound = () => (
    <Fragment>
        <Helmet>
            <title>Page not found</title>
        </Helmet>
        <h2 className="text-5xl md:text-xxl text-center text-white py-20">Oops!</h2>
        <p className="text-center py-4 text-white">
            The page you are looking for does not exist.
        </p>
        <p className="text-center">
            <a className="text-orange" href="/">
                Return to homepage
            </a>
        </p>
    </Fragment>
);

export default NotFound;
