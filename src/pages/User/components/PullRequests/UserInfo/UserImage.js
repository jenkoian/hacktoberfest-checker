import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserImage extends Component {
  constructor(props) {
    super(props);

    this.divStyle = {
      backgroundImage: 'url(' + this.props.userImage + ')',
    };
  }

  render = () => (
    <div className="h-24 w-24 relative my-4 mx-0 border-solid border-4 border-white-600 light-mode:border-light-pink">
      <img src={this.props.userImage} alt={this.props.username} />
    </div>
  );
}

UserImage.propTypes = {
  username: PropTypes.string.isRequired,
  userImage: PropTypes.string.isRequired,
};

export default UserImage;
