import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import SiteTitle from '../../components/SiteTitle';
import Navbar from '../../components/Navbar';
import UsernameForm from '../../components/UsernameForm';
import PullRequests from '../User/components/PullRequests';

const Team = () => {
  const [team, setTeam] = useState(
    JSON.parse(localStorage.getItem('myTeam') || '[]')
  );

  const addTeamMember = (username) => {
    if (!team.includes(username)) {
      const newTeam = [...team, username];
      setTeam(newTeam);
      localStorage.setItem('myTeam', JSON.stringify(newTeam));
    }
  };

  const removeTeamMember = (username) => {
    const newTeam = team.filter((member) => member !== username);
    setTeam(newTeam);
    localStorage.setItem('myTeam', JSON.stringify(newTeam));
  };

  const onCheckUser = (username) => {
    console.log('check ', username);
    addTeamMember(username);
  };

  return (
    <>
      <Helmet>
        <title>My Team and Friends</title>
      </Helmet>
      <SiteTitle />
      <Navbar />
      <UsernameForm onCheckUser={onCheckUser} />
      <div className="text-center">
        {!team.length && (
          <p className="text-hack-fg light-mode:text-hack-dark-title">
            Start by checking some team members
          </p>
        )}
        {team.map((username) => (
          <div key={username}>
            <PullRequests username={username} />
            <button
              className="transition duration-300 bg-hack-alt-bg hover:bg-hack-alt-fg px-4 pointer text-hack-fg"
              onClick={() => removeTeamMember(username)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Team;
