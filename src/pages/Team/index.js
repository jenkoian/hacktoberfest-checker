import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from 'components/Navbar';
import SiteTitle from 'components/SiteTitle';
import UsernameForm from 'components/UsernameForm';
import IssuesLink from '../User/components/PullRequests/IssuesLink';
import TeamPullRequests from './components/TeamPullRequests';
import useTeam from './hooks/useTeam';

const Team = () => {
  const { team, addTeamMember, removeTeamMember } = useTeam();

  return (
    <>
      <Helmet>
        <title>My Team and Friends</title>
      </Helmet>
      <SiteTitle />
      <Navbar />
      <UsernameForm onCheckUser={addTeamMember} />
      {!team.length && (
        <p className="text-center text-hack-fg light-mode:text-hack-dark-title">
          Start by checking some team members
        </p>
      )}
      {team && !!team.length && (
        <TeamPullRequests team={team} removeTeamMember={removeTeamMember} />
      )}
      <div className="mt-8">
        <IssuesLink />
      </div>
    </>
  );
};

export default Team;
