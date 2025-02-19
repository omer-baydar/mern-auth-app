const winston = require("winston");

const errorLogPath = process.env.ERROR_LOG_FILE_PATH;
const infoLogPath = process.env.INFO_LOG_FILE_PATH;

const transports =[

    new winston.transports.File({
    filename:errorLogPath,
    level:"error",
    format:winston.format.combine(winston.format.timestamp({format:"YYYY-MM-DD HH:mm:ss"}),
                                  winston.format.printf((info)=>{return `${info.timestamp} ${info.level.toLocaleUpperCase()} ${info.stack||info.message}`}))
    }),
    new winston.transports.File({
    filename:infoLogPath,
    level:"info",
    format:winston.format.combine(winston.format((info)=>{if(info.level==="info")return info; else return false;})(),
                                  winston.format.timestamp({format:"YYYY-MM-DD HH:mm:ss"}),
                                  winston.format.printf((info)=>{return `${info.timestamp} ${info.level.toUpperCase()} ${info.message}`}))
    })
]

    if(process.env.NODE_ENV==="development" || process.env.NODE_ENV==="test"){

        transports.push(new winston.transports.Console({
            level:"info",
            format:winston.format.combine(winston.format.timestamp({format:"YYYY-MM-DD HH:mm:ss"}),
                                          winston.format.printf((info)=>{return `${info.timestamp} ${info.level.toUpperCase()} ${info.stack||info.message}`}))
        }));

    }

const logger =winston.createLogger({

    transports:transports


});

const flushAndExit=()=>{

    logger.on("finish",()=>{

        process.exit(1000);
    
    })

logger.end();

}

module.exports={logger,flushAndExit}