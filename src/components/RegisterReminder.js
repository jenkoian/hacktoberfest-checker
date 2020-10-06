import React from 'react';

const RegisterReminder = () => (
  <div className="flex flex-none items-center justify-center p-2 pl-4 bg-dark-blue-alt text-mid-grey">
    <svg
      className="w-4 h-4"
      data-icon="info"
      viewBox="0 0 32 32"
      style={{ fill: 'currentcolor' }}
    >
      <title>info</title>
      <path d="M16 0 A16 16 0 0 1 16 32 A16 16 0 0 1 16 0 M19 15 L13 15 L13 26 L19 26 z M16 6 A3 3 0 0 0 16 12 A3 3 0 0 0 16 6" />
    </svg>
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
