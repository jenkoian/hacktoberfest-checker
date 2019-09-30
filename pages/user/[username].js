import React, { Fragment } from 'react';
import { useRouter } from 'next/router'
import { Helmet } from 'react-helmet';
import SiteTitle from '../../components/SiteTitle';
import UsernameForm from '../../components/UsernameForm';
import PullRequests from './components/PullRequests';
import GithubCorner from "../../components/GithubCorner";
import RegisterReminder from "../../components/RegisterReminder";
import PageWrapper from "../../components/PageWrapper";
import Footer from "../../components/Footer";

const User = () => {
  const router = useRouter();
  const { username } = router.query;

  return (
    <Fragment>
      <Helmet>
        <title>{username}</title>
      </Helmet>
      <GithubCorner />
      <RegisterReminder />
      <PageWrapper>
        <SiteTitle>Hacktoberfest Checker</SiteTitle>
        <UsernameForm username={username}/>
        <PullRequests username={username}/>
      </PageWrapper>
      <Footer />
    </Fragment>
  );
};

export default User;
