import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import SiteTitle from '../../components/SiteTitle';
import UsernameForm from '../../components/UsernameForm';
import PullRequests from './components/PullRequests';
import UserShare from './components/PullRequests/UserShare.js';

const User = () => {
  let { username } = useParams();

  return (
    <Fragment>
      <Helmet>
        <title>{username}</title>
      </Helmet>
      <SiteTitle />
      <UsernameForm username={username} />
      <PullRequests username={username} />
      <UserShare />
    </Fragment>
  );
};

User.propTypes = {
  username: PropTypes.string,
};

export default User;
