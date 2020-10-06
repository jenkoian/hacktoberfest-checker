import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import LoadingIcon from './LoadingIcon';
import ErrorText from './ErrorText';
import pullRequestAmount from './pullRequestAmount';
import ShareButtons from './ShareButtons';
import UserInfo from './UserInfo';
import PullRequest from './PullRequest';
import IssuesLink from './IssuesLink';
import MeLinkInfo from './MeLinkInfo';

export default class PullRequests extends Component {
  static defaultProps = {
    username: PropTypes.string.isRequired,
  };

  state = {
    loading: true,
    data: null,
    error: null,
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

    this.setState({
      loading: true,
    });

    fetch(`${apiUrl}/prs?username=${username}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((pullRequests) =>
        this.setState({
          loading: false,
          data: pullRequests,
        })
      )
      .catch((error) =>
        this.setState({
          loading: false,
          error,
        })
      );
  };

  getErrorMessage = () => {
    const { data, error } = this.state;

    if (error && error.description) {
      return error.error_description;
    }

    if (data && data.error_description) {
      return data.error_description;
    }

    return "Couldn't find any data or we hit an error, err try again?";
  };

  render = () => {
    const username = this.props.username;
    const { loading, data, error } = this.state;

    if (loading) {
      return <LoadingIcon />;
    }

    if (error || data.error_description) {
      return <ErrorText errorMessage={this.getErrorMessage()} />;
    }

    const isComplete = data.prs.length >= pullRequestAmount;

    return (
      <Fragment>
        <div className="text-center text-white">
          <ShareButtons
            username={username}
            pullRequestCount={data.prs.length}
          />
          <UserInfo
            username={username}
            userImage={data.userImage}
            pullRequestCount={data.prs.length}
          />
        </div>
        <div className="mx-auto w-5/6 lg:w-1/2 mb-4">
          {data.prs.length > 0 &&
            data.prs.map((pullRequest, i) => (
              <PullRequest pullRequest={pullRequest} key={i} />
            ))}
        </div>
        {!isComplete && <IssuesLink />}
        <MeLinkInfo username={username} />
      </Fragment>
    );
  };
}
