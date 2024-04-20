import * as winston from 'winston';

const logger = winston.createLogger({
  // level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
