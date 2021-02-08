import React, { useReducer, useEffect } from "react";
import axios from "axios";

const BASE_URL = "/positions.json";

//cors-anywhere.herokuapp.com/
// const initialState = {
//   jobs: [],
//   loading: true,
// };

const ACTIONS = {
  MAKE_REQUEST: "make-request",
  GET_DATA: "get-data",
  Error: "error",
  UPDATE_HAS_NEXT_PAGE: "update-has-next-page",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, jobs: [] };
    case ACTIONS.GET_DATA:
      return { ...state, jobs: action.payload.jobs, loading: false };
    case ACTIONS.Error:
      return { ...state, loading: false, error: action.payload.jobs, jobs: [] };
    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage };
    default:
      return state;
  }
};
const useFetchJobs = (params, page) => {
  const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });
  useEffect(() => {
    const cancelToken1 = axios.CancelToken.source();

    dispatch({ type: ACTIONS.MAKE_REQUEST });
    axios
      .get(BASE_URL, {
        cancelToken: cancelToken1.token,
        params: { markdown: true, page: page, ...params },
      })
      .then((res) => {
        dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } });
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        dispatch({ type: ACTIONS.Error, payload: { error: e } });
      });

    // Another axios request to check another page exist or not.
    const cancelToken2 = axios.CancelToken.source();
    axios
      .get(BASE_URL, {
        cancelToken: cancelToken2.token,
        params: { markdown: true, page: page + 1, ...params },
      })
      .then((res) => {
        dispatch({
          type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
          payload: { hasNextPage: res.data !== 0 },
        });
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        dispatch({ type: ACTIONS.Error, payload: { error: e } });
      });

    return () => {
      cancelToken1.cancel();
      cancelToken2.cancel();
    };
  }, [params, page]);

  return state;
};

export default useFetchJobs;
