import React from 'react';
import PropTypes from 'prop-types';

const ShareButtons = ({ username }) => (
  <div className="pb-8 flex justify-center">
    <div className="p-2" id="twitter-share">
      <a
        target="_blank"
        className="bg-blue text-white rounded px-2 py-1 pointer text-white no-underline text-sm"
        href="https://twitter.com/intent/tweet?text=My progress on hacktoberfest {{ prs.length }} / {{prAmount}}&url={{hostname}}/?username={{username}}&hashtags=hacktoberfest, hacktoberfestchecker"
        data-size="large"
      >
        <i className="fab fa-twitter fa-lg" />
        Tweet
      </a>
    </div>
    <div
      className="p-2"
      id="fb-share"
      data-href={`${window.location.origin}/username/${username}`}
      data-layout="button"
      data-size="large"
    >
      <a
        target="_blank"
        className="fb-xfbml-parse-ignore bg-blue-dark text-white rounded px-2 py-1 pointer text-white no-underline text-sm"
        href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}%2F%3Fusername%3D${username}&amp;src=sdkpreparse`}
      >
        <i className="fab fa-facebook fa-lg" />
        Share
      </a>
    </div>
  </div>
);

ShareButtons.propTypes = {
  username: PropTypes.string.isRequired
};

export default ShareButtons;
