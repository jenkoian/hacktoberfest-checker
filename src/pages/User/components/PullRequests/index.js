import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LoadingIcon from './LoadingIcon';
import ErrorText from './ErrorText';
import pullRequestAmount from './pullRequestAmount';
import UserInfo from './UserInfo';
import IssuesLink from './IssuesLink';
import MeLinkInfo from './MeLinkInfo';

export default class PullRequests extends Component {
  static defaultProps = {
    username: PropTypes.string.isRequired
  };

  state = {
    loading: true,
    data: null,
    error: null
  };

  componentDidMount = () => {
    this.storeUsernameAsMe();
    this.fetchPullRequests();
  };

  componentDidUpdate = (prevProps) => {
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

  fetchPullRequests = () => {
    const username = this.props.username;
    const apiUrl = process.env.REACT_APP_API_URL;
    fetch(`${apiUrl}/pullRequests?username=${username}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(pullRequests =>
        this.setState({
          loading: false,
          data: pullRequests
        })
      )
      .catch(error =>
        this.setState({
          loading: false,
          error
        })
      );
  };

  render = () => {
    const username = this.props.username;
    const { loading, data, error } = this.state;

    if (loading) {
      return <LoadingIcon />
    }

    if (error) {
      return <ErrorText errorMessage={error.error_description} />;
    }

    const isComplete = data.prs.length >= pullRequestAmount;

    return (
      <Fragment>
        <div className="text-center text-white">
          <UserInfo
            username={username}
            userImage={data.userImage}
            pullRequestCount={data.prs.length}
          />
        </div>
        {!isComplete &&
          <IssuesLink />
        }
        <MeLinkInfo username={username} />
      </Fragment>
    );
  }
}
