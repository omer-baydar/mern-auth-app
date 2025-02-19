const {logger,flushAndExit} = require("../utils/logger");

const handleProcessExceptions=()=>{

process.on("uncaughtException",(err)=>{

    logger.error("",err);
    logger.info("",err);
    flushAndExit();
   
});
process.on("unhandledRejection",(err)=>{

logger.error("",err);
logger.info("",err);

flushAndExit()
})

}

module.exports={handleProcessExceptions}

