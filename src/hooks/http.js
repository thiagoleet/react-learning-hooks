// custom hook
import { useCallback, useReducer } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const actions = {
  SEND_REQUEST: "SEND REQUEST",
  RESPONSE: "RESPONSE",
  ERROR: "ERROR",
  CLEAR: "CLEAR",
};

const reducer = (currHttpState, action) => {
  switch (action.type) {
    case actions.SEND_REQUEST:
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case actions.RESPONSE:
      return {
        ...currHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case actions.ERROR:
      return { loading: false, error: action.errorMessage };
    case actions.CLEAR:
      return { ...initialState };

    default:
      throw new Error("Should not be reached!");
  }
};

const useHttp = () => {
  const [httpState, dispatch] = useReducer(reducer, initialState);

  const clear = useCallback(() => {
    dispatch({ type: actions.CLEAR });
  }, []);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatch({
        type: actions.SEND_REQUEST,
        identifier: reqIdentifier,
      });
      fetch(url, {
        method,
        body,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          dispatch({
            type: actions.RESPONSE,
            responseData,
            extra: reqExtra,
          });
        })
        .catch((error) => {
          const message = "Something went wrong";
          dispatch({ type: actions.ERROR, errorMessage: message });
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    extra: httpState.extra,
    identifier: httpState.identifier,
    sendRequest,
    clear,
  };
};

export default useHttp;
