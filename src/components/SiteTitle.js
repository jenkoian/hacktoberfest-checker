import React from 'react';
import frogtoberfestImage from '../assets/images/Frogtoberfest Logo 1x.png';
import { HOSTNAME } from '../config';

const SiteTitle = () => (
  <div className="text-center" style={styles}>
    <a className="text-white no-underline" href={HOSTNAME}>
      <img alt="Frogtoberfest Artwork" src={frogtoberfestImage} />
    </a>
  </div>

  // </h1>
);

const styles = {
  margin: '0px auto',
  width: '55%'
};

export default SiteTitle;
