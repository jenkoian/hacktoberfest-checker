import { useReducer, useEffect } from 'react';

const ACTIONS = {
  PULL_REQUESTS_LOADING: 'PULL_REQUESTS_LOADING',
  PULL_REQUESTS_FETCHED: 'PULL_REQUESTS_FETCHED',
  PULL_REQUESTS_FETCH_ERROR: 'PULL_REQUESTS_FETCH_ERROR',
};

const API_URL = process.env.REACT_APP_API_URL;

async function fetchPullRequests(username) {
  const response = await fetch(`${API_URL}/prs?username=${username}`, {
    method: 'GET',
  });
  const data = response.json();
  return data;
}

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

  useEffect(async () => {
    if (username === '') return;
    dispatch({ type: ACTIONS.PULL_REQUESTS_LOADING });

    const fetchPR = async () => {
      const response = await fetchPullRequests(username);
      return response;
    };

    const response = await fetchPR();

    const data = dispatch({
      type: ACTIONS.PULL_REQUESTS_FETCHED,
      payload: { response },
    });

    const errors = dispatch({
      type: ACTIONS.PULL_REQUESTS_FETCH_ERROR,
      payload: { data },
    });

    if (errors) {
      throw new Error(errors);
    }
  }, [username]);

  return { loading, data, error };
}
