import React, { Fragment } from 'react';
import SiteTitle from '../../components/SiteTitle';
import SocialM from '../../components/SocialM';
import UsernameForm from '../../components/UsernameForm';

const Home = () => (
  <Fragment>
    <SiteTitle />
    <UsernameForm />
    <SocialM />
  </Fragment>
);

export default Home;
