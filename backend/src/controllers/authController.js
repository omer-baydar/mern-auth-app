const Sessions = require("../models/sessionModel");
const jwt = require("jsonwebtoken");
const bcrypt= require("bcrypt");
const crypto= require("crypto");
const {logger} = require("../utils/logger");

const refreshTokens=async(req,res)=>{

    try{

        const refreshToken = req.cookies?.authentication;
        if(refreshToken){

            const {id,role,sessionId} = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_KEY);
          
            try{
                const session = await Sessions.findOne({sessionId:sessionId,userId:id});
               

                if(session){

                    const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

                    const check = session.hashedRefreshToken===hashedToken;

                    if(check){

                        const now = new Date();

                        const day = 24*60*60*1000;

                        if((now - session.createdAt)>day){

                           await Sessions.deleteOne({sessionId:sessionId});

                           res.clearCookie("authentication",{httpOnly:true,secure:true,sameSite:"Strict"});
                           return res.status(401).send({success:false});

                        }
                        else{
                            const newRefreshToken = jwt.sign({id:id,role:role,sessionId:sessionId},process.env.REFRESH_TOKEN_KEY,{expiresIn:"2h"});
                            const accessToken= jwt.sign({id:id,role:role,sessionId:sessionId},process.env.ACCESS_TOKEN_KEY,{expiresIn:"15m"});

                            const hashedRefreshToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

                            await Sessions.findOneAndUpdate({sessionId:sessionId},{hashedRefreshToken:hashedRefreshToken});

                            
                            res.cookie("authentication",newRefreshToken,{httpOnly:true,sameSite:"strict",secure:true,maxAge:2*60*60*1000});

                            if(session.deviceId!==req.cookies.deviceId){

                            res.cookie("deviceId",session.deviceId,{httpOnly:true,secure:true,sameSite:"strict",maxAge:365*24*60*60*1000});

                            }

                            return res.status(200).send({success:true,accessToken:accessToken,role:role});

                        }

                       

                    }
                    else{

                        //  Race-condition
                        await Sessions.deleteOne({sessionId:session.sessionId});

                        res.clearCookie("authentication",{httpOnly:true,secure:true,sameSite:"Strict"});
                        return res.status(401).send({success:false});
                    }

                }
                else{
                    
                    res.clearCookie("authentication",{httpOnly:true,secure:true,sameSite:"Strict"});
                    return res.status(401).send({success:false});

                }

            }
            catch(err){
                
                logger.error("",err);
                
                return res.status(500).send({success:false});

            }
           

        }
        else{
            return res.status(401).send({success:false});
        }


    }
    catch(err){
        
        res.clearCookie("authentication",{httpOnly:true,secure:true,sameSite:"Strict"});

        return res.status(401).send({success:false});
    }
    

}


module.exports ={refreshTokens};