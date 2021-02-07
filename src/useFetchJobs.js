import { useReducer, useEffect } from "react";
import axios from "axios";
const initialState = {
  jobs: [],
  loading: true,
};

const ACTIONS = {
  MAKE_REQUEST: "make-request",
  GET_DATA: "get-data",
  Error: "error",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, jobs: [] };
    case ACTIONS.GET_DATA:
      return { ...state, jobs: action.payload.jobs, loading: false };
    case ACTIONS.Error:
      return { ...state, loading: false, error: action.payload.jobs, jobs: [] };
    default:
      return state;
  }
};
const useFetchJobs = (params, page) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({ type: MAKE_REQUEST });
  }, [params, page]);

  return {
    jobs: [],
    error: false,
    loading: false,
  };
};

export default useFetchJobs;
