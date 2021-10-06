import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types';

const logCallsRemaining = (
  res: RestEndpointMethodTypes['users']['getByUsername']['response']
) => {
  const callsRemaining = (res.headers[
    'x-ratelimit-remaining'
  ] as unknown) as number;

  if (process.env.NODE_ENV !== 'production' || callsRemaining < 100) {
    console.log(`API calls remaining: ${callsRemaining}`);
  }

  return res;
};

export default logCallsRemaining;
