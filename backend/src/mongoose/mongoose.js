const mongoose = require("mongoose");
const {logger} = require("../utils/logger");
const connectMongoose =()=>{

    mongoose.connect(process.env.MONGOURI).then(()=>{



    logger.info("Mongodb Connected")}).catch(()=>{
    logger.error("An Error Occurred While Connecting To Mongodb");
    logger.info("An Error Occurred While Connecting To Mongodb");
    });

}

module.exports=connectMongoose;