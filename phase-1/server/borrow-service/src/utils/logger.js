import winston from 'winston';

const logger = winston.createLogger({
    level : 'debug',
    format : winston.format.combine(
        winston.format.json(),
        winston.format.timestamp()
    ),
    defaultMeta : { service: 'borrow-service'},
    transports: [
        new winston.transports.File({filename:'error.log',level:'error'}),
        new winston.transports.File({filename : 'app.log'})
    ]
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
export default logger;
