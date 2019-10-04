import React, { Fragment } from 'react';
import SiteTitle from '../../components/SiteTitle';
import UsernameForm from '../../components/UsernameForm';

const Home = () => (
  <Fragment>
    <SiteTitle>Frogtoberfest Checker</SiteTitle>
    <UsernameForm />
  </Fragment>
);

export default Home;
