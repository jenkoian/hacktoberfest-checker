import { OctokitResponse } from '@octokit/types/dist-types';

const logCallsRemaining = (res: OctokitResponse<any, number>) => {
  const callsRemaining = (res.headers[
    'x-ratelimit-remaining'
  ] as unknown) as number;

  if (process.env.NODE_ENV !== 'production' || callsRemaining < 100) {
    console.log(`API calls remaining: ${callsRemaining}`);
  }

  return res;
};

export default logCallsRemaining;
