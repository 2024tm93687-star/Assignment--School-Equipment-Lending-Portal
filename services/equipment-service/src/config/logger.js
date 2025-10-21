import winston from 'winston';

const logger = winston.createLogger({
    level : 'debug',
    format : winston.format.combine(
        winston.format.json(),
        winston.format.timestamp
    ),
    transports: [
        new winston.transports.File({filename:'error.log',level:'error'}),
        new winston.transports.File({filename : 'app.log'})
    ]
});
export default logger;