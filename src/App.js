import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GithubCorner from './components/GithubCorner';
import RegisterReminder from './components/RegisterReminder';
import PageWrapper from './components/PageWrapper';
import Footer from './components/Footer';
import Home from './pages/Home';
import User from './pages/User';
import Me from './pages/Me';
import NotFound from './pages/NotFound';
import Faq from './pages/Faq';

const App = () => (
  <Fragment>
    <Helmet titleTemplate="%s | Hacktoberfest Checker" />
    <GithubCorner />
    <RegisterReminder />
    <PageWrapper>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/user/:username">
            <User />
          </Route>
          <Route exact path="/me">
            <Me />
          </Route>
          <Route exact path="/faq">
            <Faq />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </PageWrapper>
    <Footer />
  </Fragment>
);

export default App;
