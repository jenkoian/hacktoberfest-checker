import React from 'react';
import PropTypes from 'prop-types';
import pullRequestAmount from './pullRequestAmount';

const ShareButtons = ({ username, pullRequestCount }) => (
  <div className="pb-8 flex justify-center">
    <div className="p-2" id="twitter-share">
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="bg-mid-purple hover:bg-light-blue text-white hover:text-mid-blue px-2 py-1 pointer no-underline text-sm"
        href={`https://twitter.com/intent/tweet?text=My progress on hacktoberfest ${pullRequestCount} / ${pullRequestAmount}&url=${process.env.REACT_APP_HOSTNAME}/user/${username}&hashtags=hacktoberfest, hacktoberfestchecker`}
        data-size="large"
      >
        <i className="fab fa-twitter fa-lg" /> Tweet
      </a>
    </div>
    <div
      className="p-2"
      id="fb-share"
      data-href={`${process.env.REACT_APP_HOSTNAME}/user/${username}`}
      data-layout="button"
      data-size="large"
    >
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="fb-xfbml-parse-ignore bg-mid-purple hover:bg-light-blue text-white hover:text-mid-blue px-2 py-1 pointer no-underline text-sm"
        href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.REACT_APP_HOSTNAME}/user/${username}`}
      >
        <i className="fab fa-facebook fa-lg" /> Share
      </a>
    </div>
  </div>
);

ShareButtons.propTypes = {
  username: PropTypes.string.isRequired,
  pullRequestCount: PropTypes.number.isRequired
};

export default ShareButtons;
