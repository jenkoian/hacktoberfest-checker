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
    username: PropTypes.string.isRequired
  };

  state = {
    loading: true,
    data: null,
    error: null,
    userDetail: null
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
        `https://api.github.com/search/issues?q=author:${username}+is:pr+created:2018-10-01..2018-10-31`,
        `https://api.github.com/search/users?q=user:${username}`
      ];
      this.setState({
        loading: true
      });

      const allResponses = apiUrl.map(url =>
        fetch(url, {
          headers: {
            Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`
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

      // Promise.all(allResponses).then(pullRequests =>
      //   this.setState({
      //     loading: false,
      //     data: pullRequests[0],
      //     userDetail: pullRequests[1]
      //   })
      // );

      const [data, userDetail] = await Promise.all(allResponses);

      this.setState({
        data,
        userDetail,
        loading: false
      });
    } catch (error) {
      console.log('Error: ', error);
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

  render = () => {
    const username = this.props.username;
    const { loading, data, error, userDetail } = this.state;

    if (loading) {
      return <LoadingIcon />;
    }

    if (error || data.errors || data.message) {
      return <ErrorText errorMessage={this.getErrorMessage()} />;
    }

    const isComplete = data.items.length >= pullRequestAmount;

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
