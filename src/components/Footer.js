import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestion as questionIcon,
  faHome as homeIcon,
} from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const isFAQ = location.pathname.toLowerCase() === '/faq';
  return (
    <footer className="text-sm px-8 text-center flex-none py-4">
      <p className="text-hack-fg light-mode:text-hack-dark-title">
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
          className="bg-hack-alt-bg hover:bg-hack-alt-fg text-hack-fg transition duration-300 hover:text-hack-fg px-2 py-1 pointer no-underline text-sm"
          href={isFAQ ? '/' : '/faq'}
        >
          <FontAwesomeIcon icon={isFAQ ? homeIcon : questionIcon} />
          {isFAQ ? ' Home' : ' FAQs'}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
