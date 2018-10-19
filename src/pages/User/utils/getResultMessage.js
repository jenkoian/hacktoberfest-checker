const prAmount = 5;

const messages = [
  'It\'s not too late to start!',
  'Off to a great start, keep going!',
  'Keep it up!',
  'Nice! Now, don\'t stop!',
  'So close!',
  'Way to go!',
  'Now you\'re just showing off!'
];

const getResultMessage = (prs) => {
  const currentMonth = new Date().getMonth();

  if (currentMonth < 9) {
    return 'Last year\'s result.';
  }

  if (currentMonth > 9) {
    return 'This year\'s result.';
  }

  const isShowingOff = prs.length > prAmount;

  if (isShowingOff) {
    return messages[prAmount + 1];
  }

  return messages[prs.length];
};

export default getResultMessage;
