import { isFSA } from 'flux-standard-action';

function isFunction(fn) {
  return typeof fn === 'function';
}

function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (isFunction(action)) {
      return action(dispatch, getState, extraArgument);
    }

    if (isFSA(action) && isFunction(action.payload)) {
      return next({
        ...action,
        payload: action.payload(dispatch, getState, extraArgument),
      });
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
