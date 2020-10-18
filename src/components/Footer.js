import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion as questionIcon } from '@fortawesome/free-solid-svg-icons';

const Footer = () => (
  <footer className="text-sm px-8 text-center flex-none py-4">
    <p className="text-white light-mode:text-dark-grey">
      Disclaimer: This site is fan made and not affiliated with{' '}
      <a
        href="https://hacktoberfest.digitalocean.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Hacktoberfest
      </a>
      .
    </p>
    <div className="p-2 my-4" id="faqs">
      <a
        rel="noopener noreferrer"
        className="bg-mid-blue hover:bg-light-pink text-white transition duration-300 hover:text-white px-2 py-1 pointer no-underline text-sm"
        href="/Faq"
      >
        <FontAwesomeIcon icon={questionIcon} /> FAQs
      </a>
    </div>
  </footer>
);

export default Footer;
