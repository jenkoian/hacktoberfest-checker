import { useState } from 'react';

export default function useFriends() {
  const [friends, setFriends] = useState(
    JSON.parse(localStorage.getItem('myFriends') || '[]')
  );

  const addFriend = (username) => {
    if (!friends.includes(username)) {
      const newFriends = [...friends, username];
      setFriends(newFriends);
      localStorage.setItem('myFriends', JSON.stringify(newFriends));
    }
  };

  const removeFriend = (username) => {
    const newFriends = friends.filter((member) => member !== username);
    setFriends(newFriends);
    localStorage.setItem('myFriends', JSON.stringify(newFriends));
  };

  return { friends, addFriend, removeFriend };
}
