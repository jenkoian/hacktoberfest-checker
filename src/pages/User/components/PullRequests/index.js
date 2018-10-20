import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PullRequests extends Component {
  static defaultProps = {
    username: PropTypes.string.isRequired
  };

  state = {
    loading: true,
    data: null,
    error: null
  };

  componentDidMount = () => this.fetchPullRequests();

  componentDidUpdate = (prevProps) => {
    if (prevProps.username === this.props.username) return;
    this.fetchPullRequests();
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

  render = () => (
    <h1>hang on</h1>
  );
}
