import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';

const RegisterReminder = () => (
  <div className="flex flex-none items-center justify-center p-2 pl-4 bg-hack-alt-bg light-mode:bg-hack-alt-bg text-hack-title light-mode:text-hack-title">
    <FontAwesomeIcon icon={infoIcon} size={'sm'} title="info" />

    <span className="text-md leading-tight ml-4 mr-16 md:mr-8">
      Remember to{' '}
      <a
        href="https://hacktoberfest.digitalocean.com/profile"
        target="_blank"
        rel="noopener noreferrer"
      >
        register
      </a>{' '}
      to be eligible for the tee or tree!
    </span>
  </div>
);

export default RegisterReminder;
