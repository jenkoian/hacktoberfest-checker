import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MeContext } from '../../../../context/Me';

export default class MeLinkInfo extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
  };

  static contextType = MeContext;

  storeUsernameAsMe = () => {
    this.context.setMe(this.props.username);
  };

  render = () => {
    let storeUsernameBtn = (
      <button
        className="bg-hack-logo text-hack-fg hover:bg-hack-alt-logo hover:text-hack-fg mx-auto mt-2 h-8 border-none pointer rounded-sm px-4 block saveUser"
        onClick={this.storeUsernameAsMe}
      >
        This is Me
      </button>
    );
    let infoStr = (
      <p className="text-hack-fg light-mode:text-hack-dark-title mx-auto text-center my-4">
        In the future, you can find your PRs by visiting{' '}
        <a
          href={`${process.env.REACT_APP_HOSTNAME}/me`}
          className="link saveUser"
          id="melink"
        >
          {process.env.REACT_APP_HOSTNAME}
          /me
        </a>{' '}
        on this device.
      </p>
    );
    if (this.context.me === this.props.username) {
      storeUsernameBtn = null;
      infoStr = (
        <p className="text-hack-fg light-mode:text-hack-dark-title mx-auto text-center my-4">
          Username {this.props.username} saved! You can visit{' '}
          <a
            href={`${process.env.REACT_APP_HOSTNAME}/me`}
            className="link saveUser text-hack-logo light-mode:text-hack-dark-title"
            id="melink"
          >
            {process.env.REACT_APP_HOSTNAME}
            /me
          </a>{' '}
          now!
        </p>
      );
    }
    return (
      <div className="rounded mx-auto mt-16 overflow-hidden w-5/6 lg:w-1/2 mt-4">
        {storeUsernameBtn}
        {infoStr}
      </div>
    );
  };
}
