import React from 'react';

const Footer = () => (
  <footer className="text-sm px-8 text-center flex-none py-4">
    <p className="text-white">
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
    </p>
    <p className="text-white">
      <a href="/Faq">F.A.Q.</a>
    </p>
  </footer>
);

export default Footer;
