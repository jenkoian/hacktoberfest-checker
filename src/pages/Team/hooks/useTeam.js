import { useState } from 'react';

export default function useTeam() {
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

  return { team, addTeamMember, removeTeamMember };
}
