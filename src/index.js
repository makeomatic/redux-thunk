import { isFSA } from 'flux-standard-action';

function isFunction(fn) {
  return typeof fn === 'function';
}

function createThunkMiddleware(opts = {}) {
  return ({ dispatch, getState }) => next => function processAction(action) {
    if (isFunction(action)) {
      const nextStep = action(dispatch, getState, opts.extraArgument);
      return opts.next ? processAction(nextStep) : nextStep;
    }

    if (isFSA(action) && isFunction(action.payload)) {
      const nextStep = action.payload(dispatch, getState, opts.extraArgument);
      if (nextStep === null && opts.interrupt) {
        return nextStep;
      }

      return next({ ...action, payload: nextStep });
    }

    // do not pass on empty action
    if (opts.interrupt && (action === null || action === undefined)) {
      return action;
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;
thunk.withOpts = createThunkMiddleware;

export default thunk;
