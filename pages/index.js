import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import GithubCorner from '../components/GithubCorner';
import RegisterReminder from '../components/RegisterReminder';
import PageWrapper from '../components/PageWrapper';
import Footer from '../components/Footer';
import Home from './home';

const App = () => (
  <Fragment>
    <Helmet titleTemplate="%s | Hacktoberfest Checker" />
    <GithubCorner />
    <RegisterReminder />
    <PageWrapper>
      <Home />
    </PageWrapper>
    <Footer />
  </Fragment>
);

export default App;
