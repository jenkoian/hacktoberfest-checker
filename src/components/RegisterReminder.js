import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';

const RegisterReminder = () => (
  <div className="flex flex-none items-center justify-center p-2 pl-4 bg-dark-blue-alt light-mode:bg-light-blue text-mid-grey light-mode:text-dark-grey">
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
