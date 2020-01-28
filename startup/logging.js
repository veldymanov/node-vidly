const config = require('config');
const { createLogger, format, transports } = require('winston');
const { colorize, combine, json, timestamp, label, prettyPrint, simple, printf } = format;
require('winston-mongodb');

// winston bug fix for Console
const messageFormat = format(info => {
  if (info.level === "error") {
    const errorMessage = info[Symbol.for("splat")][0].message;
    info.message = info.message.replace(errorMessage, "");
  }

  return info
})

const consoleFormat = printf(({ level, message }) => {
  return `${level}: ${message}`;
});

// High level (Node, not express) errors
// Syncronous (handleExceptions: true,)
// process.on('uncaughtException', (err) => {
//   winston.error(err.message, { stack: err.stack, metadata: err });
//   process.exit(1);
// });
// Asyncronous
process.on('unhandledRejection', (err) => {
  throw err;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.MongoDB({ db: config.get('db'), level: 'error', metaKey: 'stack' }),
    new transports.File({ filename: 'combined.log' }),
  ],
  exceptionHandlers: [
    new transports.Console({
      format: combine(
        messageFormat(),
        colorize(),
        consoleFormat
      )
    }),
    new transports.File({
      filename: 'exceptions.log',
      exitOnError: true,
    }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      messageFormat(),
      colorize(),
      consoleFormat
    ),
  }));
}

exports.logger = logger;
