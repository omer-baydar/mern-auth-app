const bcrypt = require("bcrypt");

const Users = require("../models/userModel");
const Sessions = require("../models/sessionModel");
const jwt = require ("jsonwebtoken");
const {v4:uuidv4} =require("uuid");
const crypto = require("crypto")
const {logger} = require("../utils/logger");

const login=async(req,res)=>{

    try{
        const user = await Users.findOne({email:req.body.email});

        if(user){
    
            const check = await bcrypt.compare(req.body.password,user.password);

            if(check){
    
                const sessionId=uuidv4();

                const refreshToken = jwt.sign({id:user._id,role:user.role,sessionId:sessionId},process.env.REFRESH_TOKEN_KEY,{expiresIn:"2h"});
                const accessToken = jwt.sign({id:user._id,role:user.role,sessionId:sessionId},process.env.ACCESS_TOKEN_KEY,{expiresIn:"15m"});

                let deviceId=req.cookies.deviceId;

                if(deviceId&&typeof deviceId==="string"&&deviceId.length===36){

                    await Sessions.deleteOne({deviceId:deviceId});

                }
                else{
                    deviceId = uuidv4();
                }

                const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");                

                await Sessions.create({hashedRefreshToken:hashedRefreshToken,sessionId:sessionId,deviceId:deviceId,userId:user._id});

                res.cookie("authentication",refreshToken,{httpOnly:true,maxAge:2*60*60*1000,secure:true,sameSite:"Strict"});

                res.cookie("deviceId",deviceId,{httpOnly:true,maxAge:360*24*60*60*1000,secure:true,sameSite:"Strict"});

                return res.status(200).send({success:true,accessToken:accessToken,role:user.role});

            }
            else{
                return res.status(400).send({success:false,errorType:"AuthenticationError"});

            }
    
        }
        else{
            return res.status(400).send({success:false,errorType:"AuthenticationError"});
        }
    }
    catch(err){

        logger.error("",err);

        return res.status(500).send({success:false,errorType:"UnknownError"});

    }
   

};

const register=async(req,res)=>{

    try{
        
        await Users.create({
            name:req.body.name,
            surname:req.body.surname,
            email:req.body.email,
            password:req.body.password
        });

        return res.status(200).send({success:true});
    }
    catch(err){


        if(err?.code===11000){
            return res.status(400).send({success:false,errorType:"DuplicatedKeyError"});
        }
        else{
            logger.error("",err);
            return res.status(500).send({success:false,errorType:"UnknownError"});

        }
    }

}

const logout=async (req,res)=>{

    try{
        

        const result = await Sessions.deleteOne({userId:req.userId,sessionId:req.sessionId});

        if(result.deletedCount>0){
    
            res.clearCookie("authentication",{sameSite:"Strict",secure:true,httpOnly:true});
    
            return res.status(200).send({success:true});
    
        }
        else{

            const err = new Error("Bilinmeyen hata");

            logger.error("",err);
            

            const result = await Sessions.deleteMany({userId:req.userId});
    
            if(result.deletedCount>0){
    
                res.clearCookie("authentication",{sameSite:"Strict",secure:true,httpOnly:true});
    
                return res.status(200).send({success:true});
    
            }
            else{
    
                res.clearCookie("authentication",{sameSite:"Strict",secure:true,httpOnly:true});
    
                return res.status(500).send({success:false,errorType:"UnknownError"});
    
            }
        }
    

    }
    catch(err){


        logger.error("",err);

        res.clearCookie("authentication",{sameSite:"Strict",secure:true,httpOnly:true});
    
        return res.status(500).send({success:false});

    }
    
    


}


module.exports={login,register,logout};
