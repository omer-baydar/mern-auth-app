
const express = require("express");
const app = express();
require("dotenv").config();
const userRoute = require("./src/routes/userRoute");
const connectMongoose = require("./src/mongoose/mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./src/routes/authRoute");
const cors = require("cors");
const {logger,flushAndExit} = require("./src/utils/logger")
const {handleProcessExceptions} = require("./src/middlewares/errorHandling");
const rateLimit = require("express-rate-limit");

handleProcessExceptions();

connectMongoose();

const reqLimiter = rateLimit({
    windowMs:60*1000,
    max:20,
    message:"to many requests",
    statusCode:429
    
});


const corsOptions={
    origin:"http://localhost:5173",
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}

app.use(cors(corsOptions));

app.use("/public",express.static("public"));

app.use(reqLimiter); // doesn't include requests to /public adress to count requests number correctly

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth",authRoute);

app.use("/api/user",userRoute);


const port = process.env.PORT;

const server = app.listen(port,()=>{logger.info("Server Started At "+ port); });

server.on("error",(error)=>{

    logger.error("",error);
    logger.info("",error);
    flushAndExit();
})



