import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FriendsContext = React.createContext();

const getDefaultFriends = () => {
  const friends = localStorage.getItem('myFriends');
  return friends ? JSON.parse(friends) : [];
};

const saveFriends = (friends) => {
  localStorage.setItem('myFriends', JSON.stringify(friends));
};

const FriendsContextProvider = ({ children }) => {
  const [friends, setFriends] = useState(getDefaultFriends());

  const addFriend = (username) => {
    if (!friends.includes(username)) {
      const newFriends = [...friends, username];
      saveFriends(newFriends);
      setFriends(newFriends);
    }
  };

  const removeFriend = (username) => {
    if (friends.includes(username)) {
      const newFriends = friends.filter((friend) => friend !== username);
      saveFriends(newFriends);
      setFriends(newFriends);
    }
  };

  return (
    <FriendsContext.Provider value={{ friends, addFriend, removeFriend }}>
      {children}
    </FriendsContext.Provider>
  );
};

FriendsContextProvider.propTypes = {
  children: PropTypes.node,
};

export { FriendsContext, FriendsContextProvider };
