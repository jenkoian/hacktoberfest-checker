import { ResponseHeaders } from '@octokit/types/dist-types/ResponseHeaders';

interface Response {
  headers: Pick<ResponseHeaders, 'x-ratelimit-remaining'>;
}

const logCallsRemaining = <T extends Response>(res: T): T => {
  if (typeof res.headers['x-ratelimit-remaining'] !== 'undefined') {
    const callsRemaining = Number(res.headers['x-ratelimit-remaining']);

    if (process.env.NODE_ENV !== 'production' || callsRemaining < 100) {
      console.log(`API calls remaining: ${callsRemaining}`);
    }
  }

  return res;
};

export default logCallsRemaining;
