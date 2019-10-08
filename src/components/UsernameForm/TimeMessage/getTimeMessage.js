const getTimeMessage = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const daysLeft = 31 - today.getDate();

  if (currentMonth !== 9) {
    return "It isn't even October yet!";
  }

  if (daysLeft === 0) {
    return "It's the very last day! Get your last PRs in!";
  }

  if (daysLeft === 1) {
    return 'One more day, keep it going!';
  }

  if (daysLeft < 10) {
    return `There are only ${daysLeft} days left! You can do it!`;
  }

  return `There are ${daysLeft} days remaining!`;
};

export default getTimeMessage;
