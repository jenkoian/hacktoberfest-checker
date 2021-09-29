import { useReducer, useEffect } from 'react';

const ACTIONS = {
  PULL_REQUESTS_LOADING: 'PULL_REQUESTS_LOADING',
  PULL_REQUESTS_FETCHED: 'PULL_REQUESTS_FETCHED',
  PULL_REQUESTS_FETCH_ERROR: 'PULL_REQUESTS_FETCH_ERROR',
};

const API_URL = process.env.REACT_APP_API_URL;

const fetchPullRequests = (username) =>
  fetch(`${API_URL}/prs?username=${username}`, {
    method: 'GET',
  }).then((response) => response.json());

const pullRequestsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.PULL_REQUESTS_LOADING:
      return { loading: true, data: null, error: null };
    case ACTIONS.PULL_REQUESTS_FETCHED:
      return { loading: false, data: action.payload.pullRequests, error: null };
    case ACTIONS.PULL_REQUESTS_FETCH_ERROR:
      return { loading: false, data: null, error: action.payload.error };
  }
};

export default function useFetchPullRequests(username) {
  const [{ loading, data, error }, dispatch] = useReducer(pullRequestsReducer, {
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    if (username === '') return;
    dispatch({ type: ACTIONS.PULL_REQUESTS_LOADING });
    fetchPullRequests(username)
      .then((pullRequests) =>
        dispatch({
          type: ACTIONS.PULL_REQUESTS_FETCHED,
          payload: { pullRequests },
        })
      )
      .catch((error) =>
        dispatch({
          type: ACTIONS.PULL_REQUESTS_FETCH_ERROR,
          payload: { error },
        })
      );
  }, [username]);

  return { loading, data, error };
}
