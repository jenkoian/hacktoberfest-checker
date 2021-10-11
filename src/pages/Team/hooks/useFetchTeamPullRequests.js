import { useEffect, useReducer, useRef } from 'react';

const ACTIONS = {
  PULL_REQUESTS_LOADING: 'PULL_REQUESTS_LOADING',
  PULL_REQUESTS_FETCHED_ONE: 'PULL_REQUESTS_FETCHED_ONE',
  PULL_REQUESTS_FETCHED_ALL: 'PULL_REQUESTS_FETCHED_ALL',
};

const API_URL = process.env.REACT_APP_API_URL;

const fetchPullRequests = (usernames, cache) => {
  return usernames.map((username) => {
    if (cache[username]) {
      return Promise.resolve(cache[username]);
    }
    return fetch(`${API_URL}/prs?username=${username}`, { method: 'GET' })
      .then((response) => {
        if (response.status !== 200) {
          return response.json().then((err) => Promise.reject(err));
        }
        return response.json();
      })
      .then((res) => {
        // cache only successful responses
        cache[username] = res;
        return res;
      })
      .catch((err) => {
        return { error: err, username };
      });
  });
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

    const requests = fetchPullRequests(usernames, cache.current);

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
