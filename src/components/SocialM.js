import React from 'react';
import { FaFacebookF, FaTwitter } from 'react-icons/fa';

export default function SocialM() {
  return (
    <div class=" flex flex-auto justify-center">
      {/* tweet */}
      <a
        href="/"
        className=" bg-hack-logo light-mode:bg-hack-logo  w-24 h-6 flex items-center justify-center "
      >
        <div>
          <FaTwitter color="white" />
        </div>
        <span className="px-2 text-hack-fg">Tweet</span>
      </a>
      <span>&nbsp;&nbsp;</span>
      {/* facebook */}
      <a
        href="/"
        className=" bg-hack-logo light-mode:bg-hack-logo  w-24 h-6 flex items-center justify-center "
      >
        <div>
          {' '}
          <FaFacebookF color="white" />
        </div>
        <span className="px-2 text-hack-fg">Share</span>
      </a>
    </div>
  );
}
