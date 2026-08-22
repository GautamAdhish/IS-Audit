/**
 * Wraps an async Express route handler so any rejected promise (thrown
 * error) is forwarded to next(), landing in the global error handler
 * instead of crashing the process or hanging the request.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
