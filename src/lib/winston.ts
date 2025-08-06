/**
 * Node Modules
 */
import winston from "winston";

/**
 * Custom Modules
 */
import config from "@/config";

const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;

//Define the transports array to hold different logging transports
const transports: winston.transport[] = [];

//If the application is not running in production, add a console transport
if(config.NODE_ENV != 'production') {
    transports.push(
        new winston.transports.Console({
            format: combine(
                colorize({all: true}), //Add colors to log levels
                timestamp({ format: 'YYYY-MM-DD hh:mm:ss A'}),
                align(), //Align Log messages
                printf(({timestamp, level, message, ...meta}) => {
                    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta)}` : ' ';

                    return `${timestamp} [${level}] : ${message}${metaStr}`;
                })
            )
        })
    );
}

//Create a logger instance using winston
const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info', //Set the default logging level to 'info'
    format: combine(timestamp(), errors({stack: true}), json()), //Use JSON format for log messages
    transports,
    silent: config.NODE_ENV == 'test' //Disable logging in test environment
});

export { logger };