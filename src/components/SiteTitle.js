import React from 'react';
import frogtoberfestImage from '../assets/images/Frogtoberfest Logo 1x.png';

const SiteTitle = () => (
  // <h1 className="text-center text-5xl md:text-xxl py-12 md:py-8">
  <div className="text-center " style={styles}>
    <a className="text-white no-underline" href="">
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
