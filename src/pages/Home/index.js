import React from 'react';
import Navbar from 'components/Navbar';
import SiteTitle from 'components/SiteTitle';
import UsernameForm from 'components/UsernameForm';

const Home = () => (
  <>
    <SiteTitle />
    <Navbar />
    <UsernameForm />
  </>
);

export default Home;
