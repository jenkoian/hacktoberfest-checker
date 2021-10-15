import PropTypes from 'prop-types';
import React from 'react';
import ErrorText from '../../User/components/PullRequests/ErrorText';
import LoadingIcon from '../../User/components/PullRequests/LoadingIcon';
import UserInfo from '../../User/components/PullRequests/UserInfo';
import useFetchTeamPullRequests from '../hooks/useFetchTeamPullRequests';

const TeamPullRequests = ({ team, removeTeamMember }) => {
  const { loading, data, removeUserFromCache } = useFetchTeamPullRequests(team);

  const getErrorMessage = (val) =>
    val.error?.error_description ??
    "Couldn't find any data or we hit an error, err try again?";

  return (
    <>
      {loading ? (
        <div className="text-center">
          <LoadingIcon />{' '}
          <span className="text-hack-fg light-mode:text-hack-dark-title">
            Loading {data.length} / {team.length}
          </span>
        </div>
      ) : (
        <div className="text-center">
          <span className="text-hack-fg light-mode:text-hack-dark-title">
            Comparing {team.length} friends
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
              />
            )}
            <button
              className="transition duration-300 bg-hack-alt-bg hover:bg-hack-alt-fg px-4 pointer text-hack-fg"
              onClick={() => {
                removeUserFromCache(val.username);
                removeTeamMember(val.username);
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

TeamPullRequests.propTypes = {
  team: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeTeamMember: PropTypes.func.isRequired,
};

export default TeamPullRequests;
