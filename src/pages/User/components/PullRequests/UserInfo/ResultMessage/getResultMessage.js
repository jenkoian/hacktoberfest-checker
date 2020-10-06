import pullRequestAmount from '../../pullRequestAmount';

const messages = [
  "It's not too late to start!",
  'Off to a great start, keep going!',
  "Nice! Now, don't stop!",
  'So close!',
  'Way to go!',
  "Now you're just showing off!",
];

const getResultMessage = (pullRequestCount) => {
  const currentMonth = new Date().getMonth();

  if (currentMonth < 9) {
    return "Last year's result.";
  }

  if (currentMonth > 9) {
    return "This year's result.";
  }

  const isShowingOff = pullRequestCount > pullRequestAmount;

  if (isShowingOff) {
    return messages[pullRequestAmount + 1];
  }

  return messages[pullRequestCount];
};

export default getResultMessage;
