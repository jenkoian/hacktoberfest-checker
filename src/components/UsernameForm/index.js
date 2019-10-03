import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router-dom/withRouter';
import TimeMessage from './TimeMessage';
import UsernameInput from './UsernameInput';
import CheckButton from './CheckButton';

class UsernameForm extends Component {
  static propTypes = {
    username: PropTypes.string,
    // Provided by withRouter()
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };

  static defaultProps = {
    username: ''
  };

  state = {
    username: this.props.username
  };

  handleUsernameChange = e => this.setState({ username: e.target.value });

  handleSubmit = e => {
    e.preventDefault();

    const username = this.state.username;

    if (username.trim().length === 0) {
      return;
    }
    console.log(username);
    const userUrl = this.getUserUrl(username);
    this.props.history.push(userUrl);
  };

  getUserUrl = username => `/user/${username}`;

  render = () => (
    <div className="pb-4 md:pt-16">
      <TimeMessage />
      <form
        action="/"
        className="flex h-8 mx-auto w-5/6 md:w-3/5 lg:w-1/3"
        method="get"
        onSubmit={this.handleSubmit}
        style={formStyle}
      >
        <UsernameInput
          value={this.state.username}
          onChange={this.handleUsernameChange}
        />
        <CheckButton />
      </form>
    </div>
  );
}

const formStyle = {
  border: '2px solid #133370'
};

export default withRouter(UsernameForm);
