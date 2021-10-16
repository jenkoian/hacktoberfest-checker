import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MeContextProvider } from './context/Me';

import {
  GithubCorner,
  RegisterReminder,
  PageWrapper,
  Footer,
} from 'components';
import { Home, User, Me, NotFound, Faq, Friends } from 'pages';
import { FriendsContextProvider } from './context/Friends';

const App = () => (
  <>
    <Helmet titleTemplate="%s | Hacktoberfest Checker" />
    <GithubCorner />
    <RegisterReminder />
    <PageWrapper>
      <MeContextProvider>
        <FriendsContextProvider>
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
              <Route exact path="/friends">
                <Friends />
              </Route>
              <Route exact path="/faq">
                <Faq />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Router>
        </FriendsContextProvider>
      </MeContextProvider>
    </PageWrapper>
    <Footer />
  </>
);

export default App;
