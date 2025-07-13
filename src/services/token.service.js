const jwt = require('jsonwebtoken');
const moment = require('moment');

// Secret keys and expiry durations – you can load these from environment variables (.env)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_ACCESS_EXPIRATION_MINUTES = 30;
const JWT_REFRESH_EXPIRATION_DAYS = 30;

const generateToken = (userId, expires, type, secret = JWT_SECRET) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const generateAuthTokens = (user) => {
  const accessTokenExpires = moment().add(JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
  const accessToken = generateToken(user._id, accessTokenExpires, 'access');

  const refreshTokenExpires = moment().add(JWT_REFRESH_EXPIRATION_DAYS, 'days');
  const refreshToken = generateToken(user._id, refreshTokenExpires, 'refresh');

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
