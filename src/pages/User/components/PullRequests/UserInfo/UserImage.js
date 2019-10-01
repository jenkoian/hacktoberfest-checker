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
      <div className="hexagon" style={this.divStyle}>
        <div className="hexTop" />
        <div className="hexBottom" />
      </div>
  );
}

UserImage.propTypes = {
  username: PropTypes.string.isRequired,
  userImage: PropTypes.string.isRequired
};

export default UserImage;
