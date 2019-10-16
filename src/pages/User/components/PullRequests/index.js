import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LoadingIcon from './LoadingIcon';
import ErrorText from './ErrorText';
import ShareButtons from './ShareButtons';
import UserInfo from './UserInfo';
import PullRequest from './PullRequest';
import IssuesLink from './IssuesLink';
import MeLinkInfo from './MeLinkInfo';
import { GITHUB_TOKEN } from '../../../../config';

export default class PullRequests extends Component {
  static defaultProps = {
    username: PropTypes.string.isRequired
  };

  state = {
    loading: true,
    data: null,
    error: null,
    userDetail: null,
    otherReposCount: null
  };

  componentDidMount = () => {
    this.storeUsernameAsMe();
    this.fetchPullRequests();
  };

  componentDidUpdate = prevProps => {
    if (prevProps.username === this.props.username) return;
    this.fetchPullRequests();
  };

  storeUsernameAsMe = () => {
    const username = this.props.username;

    if (localStorage.getItem('myGithub')) {
      return;
    }

    localStorage.setItem('myGithub', username);
  };

  fetchPullRequests = async () => {
    try {
      const username = this.props.username;
      const apiUrl = [
        `https://api.github.com/search/issues?q=author:${username}+is:pr+created:2019-10-01..2019-10-31`,
        `https://api.github.com/search/users?q=user:${username}`
      ];
      this.setState({
        loading: true
      });

      const allResponses = apiUrl.map(url =>
        fetch(url, {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`
          }
        })
          .then(response => response.json())
          .catch(error =>
            this.setState({
              loading: false,
              error
            })
          )
      );

      const [data, userDetail] = await Promise.all(allResponses);
      const count = this.counterOtherRepos(data, userDetail);
      this.setState({
        data,
        userDetail,
        loading: false,
        otherReposCount: count,
        error: null
      });
    } catch (error) {
      this.setState({
        error,
        loading: false,
        data: null,
        userDetail: null
      });
    }
  };

  getErrorMessage = () => {
    const { data, error } = this.state;

    if (error && error.description) {
      return error.error_description;
    }

    if (data && data.errors) {
      return data.errors.message;
    }

    return "Couldn't find any data or we hit an error, err try again?";
  };

  conditionChecker(data, userDetail) {
    if (data.items.length < 10) {
      return false;
    }
    return this.state.otherReposCount >= 4;
  }

  counterOtherRepos(data, userDetail) {
    const user = userDetail.items[0].login;
    let count = 0;

    data.items.forEach((pullRequest, index) => {
      const repoOwner = pullRequest.repository_url
        .split('/repos/')
        .pop()
        .split('/')
        .shift();
      if (repoOwner !== user) {
        count++;
      }
    });

    return count;
  }

  render = () => {
    const username = this.props.username;
    const { loading, data, error, userDetail } = this.state;
    if (loading) {
      return <LoadingIcon />;
    }
    if (error || data.errors || data.message) {
      return <ErrorText errorMessage={this.getErrorMessage()} />;
    }

    const isComplete = this.conditionChecker(data, userDetail);

    return (
      <Fragment>
        <div className="text-center text-white">
          <ShareButtons
            username={username}
            pullRequestCount={data.items.length}
          />
          <UserInfo
            username={username}
            userImage={userDetail.items[0].avatar_url}
            pullRequestCount={data.items.length}
            otherReposCount={this.state.otherReposCount}
          />
        </div>
        <div className="rounded mx-auto shadow overflow-hidden w-5/6 lg:w-1/2 mb-4">
          {data.items.length > 0 &&
            data.items.map((pullRequest, i) => (
              <PullRequest pullRequest={pullRequest} key={i} />
            ))}
        </div>
        {!isComplete && <IssuesLink />}
        <MeLinkInfo username={username} />
      </Fragment>
    );
  };
}
