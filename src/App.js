import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Home from './pages/Home';
import Me from './pages/Me';
import NotFound from './pages/NotFound';

const App = () => (
  <Fragment>
    <Helmet titleTemplate="%s | Hacktoberfest Checker" />
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/me" component={Me} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </Fragment>
);

export default App;
