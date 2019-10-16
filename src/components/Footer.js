import React from 'react';
import presentedByLogo from '../assets/images/presented by logo lockup 1x.png';

const Footer = () => (
  <footer
    className="text-sm px-8 text-center flex-none py-4"
    style={footerStyle}
  >
    <a href="https://github.com/leapfrogtechnology/opensource">
      <img src={presentedByLogo} alt='Leapfrog Opensource Logo'></img></a>
  </footer>
);

const footerStyle = {
  width: '30%',
  margin: '20px auto'
};

export default Footer;
