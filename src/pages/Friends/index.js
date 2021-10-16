import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from 'components/Navbar';
import SiteTitle from 'components/SiteTitle';
import UsernameForm from 'components/UsernameForm';
import IssuesLink from '../User/components/PullRequests/IssuesLink';
import FriendsPullRequests from './components/FriendsPullRequests';
import { useContext } from 'react/cjs/react.development';
import { FriendsContext } from 'context/Friends';

const Friends = () => {
  const { friends, addFriend, removeFriend } = useContext(FriendsContext);

  return (
    <>
      <Helmet>
        <title>Compare with Friends</title>
      </Helmet>
      <SiteTitle />
      <Navbar />
      <UsernameForm onCheckUser={addFriend} />
      {!friends.length && (
        <p className="text-center text-hack-fg light-mode:text-hack-dark-title">
          Start by checking some friends to compare with
        </p>
      )}
      {friends && !!friends.length && (
        <FriendsPullRequests friends={friends} removeFriend={removeFriend} />
      )}
      <div className="mt-8">
        <IssuesLink />
      </div>
    </>
  );
};

export default Friends;
