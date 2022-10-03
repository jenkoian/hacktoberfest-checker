import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/user/:username" element={<User />} />
              <Route path="/me" element={<Me />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/faq" element={<Faq />} />
              <Route element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FriendsContextProvider>
      </MeContextProvider>
    </PageWrapper>
    <Footer />
  </>
);

export default App;
