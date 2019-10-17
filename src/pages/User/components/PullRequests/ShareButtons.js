import React from 'react';
import PropTypes from 'prop-types';
import { pullRequestAmount } from './pullRequestAmount';
import { HOSTNAME } from '../../../../config';

const ShareButtons = ({ username, pullRequestCount }) => (
  <div className="pb-8 flex justify-center">
    <div className="p-2" id="twitter-share">
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue text-white rounded px-2 py-1 pointer text-white no-underline text-sm"
        href={`https://twitter.com/intent/tweet?text=My progress on frogtoberfest ${pullRequestCount} / ${pullRequestAmount}&url=${HOSTNAME}/user/${username}&hashtags=frogtoberfest, frogtoberfest`}
        data-size="large"
      >
        <i className="fab fa-twitter fa-lg" /> Tweet
      </a>
    </div>
    <div
      className="p-2"
      id="fb-share"
      data-href={`${HOSTNAME}/username/${username}`}
      data-layout="button"
      data-size="large"
    >
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="fb-xfbml-parse-ignore bg-blue-dark text-white rounded px-2 py-1 pointer text-white no-underline text-sm"
        href={`https://www.facebook.com/sharer/sharer.php?u=${HOSTNAME}/user/${username}`}
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
