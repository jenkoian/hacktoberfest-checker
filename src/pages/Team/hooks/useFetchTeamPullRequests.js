import { useEffect, useReducer, useRef } from 'react';

const ACTIONS = {
  PULL_REQUESTS_LOADING: 'PULL_REQUESTS_LOADING',
  PULL_REQUESTS_FETCHED_ONE: 'PULL_REQUESTS_FETCHED_ONE',
  PULL_REQUESTS_FETCHED_ALL: 'PULL_REQUESTS_FETCHED_ALL',
};

const API_URL = process.env.REACT_APP_API_URL;

const fetchPullRequests = async (username) => {
  try {
    const res = await fetch(`${API_URL}/prs?username=${username}`, {
      method: 'GET',
    });
    const data = await res.json();

    if (res.status === 200) {
      return data;
    }

    return { error: data, username };
  } catch (error) {
    return { error, username };
  }
};

const fetchPullRequestsWithCache = async (username, cache) => {
  const cachedData = cache[username];

  // if we have a pendig promise in cache, await on it
  if (cachedData instanceof Promise) {
    return await cachedData;
  }

  // if we have a completed value in cache, just return it
  if (cachedData) {
    return cachedData;
  }

  // fetch the data
  // Note: we do not await on the fetch here because we want to put the Promise in the cache as soon as possible,
  // so if the user retriggers the fetch we can reuse the existing promise and not generate a new request
  const pendingData = fetchPullRequests(username);
  cache[username] = pendingData;

  // after adding the promise to the cache, we can safely await on it
  const data = await pendingData;
  if (!data.error) {
    // cache only successful results
    cache[username] = data;
  } else {
    // clear the cache, maybe the next fetch will not have errors
    delete cache[username];
  }

  return data;
};

const sortByPullRequests = (results) => {
  const sorted = results.slice();
  sorted.sort((a, b) => {
    // move errors at the end
    if (a.error) {
      return 1;
    }
    if (b.error) {
      return -1;
    }

    // sort descending by pr count and then ascending by username
    return b.prs.length - a.prs.length || a.username.localeCompare(b.username);
  });
  return sorted;
};

const pullRequestsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.PULL_REQUESTS_LOADING:
      return { ...state, loading: true, data: [] };
    case ACTIONS.PULL_REQUESTS_FETCHED_ONE:
      if (state.data.find((u) => u.username === action.payload.data.username)) {
        // some race conditions can happen if the user types many usernames faster than we can fetch them
        return state;
      }
      return {
        ...state,
        data: sortByPullRequests([...state.data, action.payload.data]),
      };
    case ACTIONS.PULL_REQUESTS_FETCHED_ALL:
      return {
        ...state,
        loading: false,
        data: sortByPullRequests(action.payload.data),
      };
  }
};

export default function useFetchTeamPullRequests(usernames) {
  // cache the results of the fetch to avoid multiple requests for users already loaded
  // otherwise every time you add one username, it will fetch again the entire list
  const cache = useRef({});
  const [{ loading, data }, dispatch] = useReducer(pullRequestsReducer, {
    loading: true,
    data: [],
  });

  useEffect(() => {
    if (!usernames || !usernames.length) return;

    dispatch({ type: ACTIONS.PULL_REQUESTS_LOADING });

    const requests = usernames.map((username) =>
      fetchPullRequestsWithCache(username, cache.current)
    );

    // track incremental progress
    requests.forEach((request) =>
      request.then((data) =>
        dispatch({ type: ACTIONS.PULL_REQUESTS_FETCHED_ONE, payload: { data } })
      )
    );

    // wait for all requests to complete
    Promise.all(requests).then((data) =>
      dispatch({ type: ACTIONS.PULL_REQUESTS_FETCHED_ALL, payload: { data } })
    );
  }, [usernames]);

  const removeUserFromCache = (username) => {
    delete cache.current[username];
  };

  return { loading, data, removeUserFromCache };
}
