function isFunction(fn) {
  return typeof fn === 'function';
}

function isValidKey(key) {
  return ['type', 'payload', 'error', 'meta'].indexOf(key) > -1;
}

function isFSA(action) {
  return (
    action !== null
    && typeof action === 'object'
    && typeof action.type === 'string'
    && Object.keys(action).every(isValidKey)
  );
}

function createThunkMiddleware(opts = {}) {
  return ({ dispatch, getState }) => (next) => function processAction(action) {
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
thunk.withExtraArgument = (extraArgument) => createThunkMiddleware({ extraArgument });
thunk.withOpts = createThunkMiddleware;

export default thunk;
