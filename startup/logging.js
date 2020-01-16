const { createLogger, format, transports } = require('winston');
const { colorize, combine, json, timestamp, label, prettyPrint, simple, printf } = format;
require('winston-mongodb');

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

const consoleErrFormat = printf(({ level, message, label }) => {
  return `[${label}] ${level}: ${message}`;
});

// module.exports = function() {
//   // High level (Node, not express) errors
//   // Syncronous (handleExceptions: true,)
//   // process.on('uncaughtException', (err) => {
//   //   winston.error(err.message, { stack: err.stack, metadata: err });
//   //   process.exit(1);
//   // });
//   // Asyncronous
//   process.on('unhandledRejection', (err) => {
//     throw err;
//   });

//   // Express errors
//   winston.add(new winston.transports.Console({
//     level: 'info'
//   }));

//   winston.add(new winston.transports.MongoDB({
//     db: 'mongodb://localhost:27017/vidly',
//     level: 'error',
//     metaKey: 'metadata'
//   }));


// }


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
  format: json(),
  // defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new transports.File({ filename: 'error.log', level: 'error' }),
    // new transports.MongoDB({ db: 'mongodb://localhost:27017/vidly', level: 'error', metaKey: 'metadata' }),
    new transports.File({ filename: 'combined.log' }),
  ],
  exceptionHandlers: [
    new transports.Console(
      messageFormat(),
      colorize(),
      consoleFormat
    ),
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
    )
  }));
}

exports.logger = logger;

