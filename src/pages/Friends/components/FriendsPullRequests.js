import PropTypes from 'prop-types';
import React from 'react';
import ErrorText from '../../User/components/PullRequests/ErrorText';
import LoadingIcon from '../../User/components/PullRequests/LoadingIcon';
import UserInfo from '../../User/components/PullRequests/UserInfo';
import useFetchFriendsPullRequests from '../hooks/useFetchFriendsPullRequests';

const FriendsPullRequests = ({ friends, removeFriend }) => {
  const { loading, data, removeUserFromCache } =
    useFetchFriendsPullRequests(friends);

  const getErrorMessage = (val) =>
    val.error?.error_description ??
    "Couldn't find any data or we hit an error, err try again?";

  return (
    <>
      {loading ? (
        <div className="text-center">
          <LoadingIcon />{' '}
          <span className="text-hack-fg light-mode:text-hack-dark-title">
            Loading {data.length} / {friends.length}
          </span>
        </div>
      ) : (
        <div className="text-center">
          <span className="text-hack-fg light-mode:text-hack-dark-title">
            Comparing {friends.length} friends
          </span>
        </div>
      )}
      <div className="text-center">
        {data.map((val) => (
          <div key={val.username}>
            {val.error ? (
              <div className="pt-4 pb-2">
                <p className="text-hack-fg light-mode:text-hack-dark-title">
                  {val.username}:
                </p>
                <ErrorText errorMessage={getErrorMessage(val)} />
              </div>
            ) : (
              <UserInfo
                username={val.username}
                userImage={val.userImage}
                pullRequestCount={val.prs.length}
                showUsernameLink
              />
            )}
            <button
              className="transition duration-300 bg-hack-alt-bg hover:bg-hack-alt-fg px-4 -mt-4 mb-4 pointer text-hack-fg"
              onClick={() => {
                removeUserFromCache(val.username);
                removeFriend(val.username);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

FriendsPullRequests.propTypes = {
  friends: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeFriend: PropTypes.func.isRequired,
};

export default FriendsPullRequests;
