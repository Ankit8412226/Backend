const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { User } = require('../models'); // Token and Otp are not used
const tokenService = require('../services/token.service');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const { email, mobile } = req.body;

  if (await User.isEmailTaken(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (await User.isMobileTaken(mobile)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile already taken');
  }

  const user = await User.create({ ...req.body });
  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.CREATED).send({
    user: user.transform(),
    tokens,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  const tokens = await tokenService.generateAuthTokens(user);

  res.send({
    user: user.transform(),
    tokens,
  });
});

module.exports = {
  register,
  login,
};
