import { isFSA } from 'flux-standard-action';

function isFunction(fn) {
  return typeof fn === 'function';
}

export default function thunkMiddleware({ dispatch, getState }) {
  return next => action => {
    if (isFunction(action)) {
      return action(dispatch, getState);
    }

    if (isFSA(action) && isFunction(action.payload)) {
      return next({
        ...action,
        payload: action.payload(dispatch, getState),
      });
    }

    return next(action);
  };
}
