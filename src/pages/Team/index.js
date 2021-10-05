import React from 'react';
import { Helmet } from 'react-helmet';
import SiteTitle from '../../components/SiteTitle';
import Navbar from '../../components/Navbar';

const Team = () => {
  return (
    <>
      <Helmet>
        <title>My Team and Friends</title>
      </Helmet>
      <SiteTitle />
      <Navbar />
      <div>My team</div>
    </>
  );
};

export default Team;
