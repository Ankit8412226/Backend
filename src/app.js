const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('morgan');
const morganMiddleware = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');



const app = express();

const http = require('http').Server(app);

if (config.env !== 'test') {
  app.use(morganMiddleware.successHandler);
  app.use(morganMiddleware.errorHandler);
}

app.use(helmet());


app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.get('/api/running', (req, res) => {
  res.send(200);
});

app.use(xss());
app.use(mongoSanitize());

app.use(compression());
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};


// enable cors
app.use(cors(corsOptions));
app.use(morgan("combined"));
app.options('*', cors(corsOptions));




app.use(passport.initialize());
passport.use('jwt', jwtStrategy);




app.use('/api/v1', routes);


app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});


app.use(errorConverter);

app.use(errorHandler);

module.exports = { app, http };
