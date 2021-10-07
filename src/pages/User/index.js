import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import SiteTitle from '../../components/SiteTitle';
import UsernameForm from '../../components/UsernameForm';
import PullRequests from './components/PullRequests';
import UserShare from './components/PullRequests/UserShare.js';
import Navbar from '../../components/Navbar';
import MeLinkInfo from './components/PullRequests/MeLinkInfo';

const User = () => {
  let { username } = useParams();

  return (
    <>
      <Helmet>
        <title>{username}</title>
      </Helmet>
      <SiteTitle />
      <Navbar />
      <UsernameForm username={username} />
      <PullRequests username={username} />
      <MeLinkInfo username={username} />
      <UserShare />
    </>
  );
};

User.propTypes = {
  username: PropTypes.string,
};

export default User;
