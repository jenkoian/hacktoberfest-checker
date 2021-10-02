const logCallsRemaining = (res) => {
  const callsRemaining = res.headers['x-ratelimit-remaining'];

  if (process.env.NODE_ENV !== 'production' || callsRemaining < 100) {
    console.log(`API calls remaining: ${callsRemaining}`);
  }

  return res;
};

export default logCallsRemaining;
