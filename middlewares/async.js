// In the app is used express-async-errors module instead
// It does not require to wrap each route handler by asyncMiddleware()
module.exports = function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  }
}