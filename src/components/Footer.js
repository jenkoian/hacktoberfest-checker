import React from 'react';
import presentedByLogo from '../assets/images/presented by logo lockup 1x.png';

const Footer = () => (
  <footer
    className="text-sm px-8 text-center flex-none py-4"
    style={footerStyle}
  >
    {/* <p className="text-white">
      Disclaimer: This site is fan made and not affiliated with{' '}
      <a
        className="text-orange"
        href="https://hacktoberfest.digitalocean.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Hacktoberfest
      </a>
      .
    </p> */}
    <img src={presentedByLogo}></img>
  </footer>
);

const footerStyle = {
  width: '30%',
  margin: '20px auto'
};

export default Footer;
