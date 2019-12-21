const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided');

  try {
    const jwtPayload = jwt.verify(token, config.get('jwtSecret'));
    req.user = jwtPayload;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}
