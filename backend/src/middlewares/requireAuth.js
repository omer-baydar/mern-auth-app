const jwt = require("jsonwebtoken");
const {logger} = require("../utils/logger");

const requireAuth=(req,res,next)=>{

    try{

        const authorization = req.headers?.authorization;

        if(authorization){

            const accessToken = authorization.split(" ")[1];

            if(accessToken){

                const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_KEY);

                if(decoded&&decoded.id&&decoded.sessionId){

                req.userId=decoded.id;
                req.sessionId=decoded.sessionId;

                return next();

                }
                else{

                    logger.error("",new Error("Bilinmeyen hata"));

                    return res.status(401).send({success:false});

                }

            }
            else{


                return res.status(401).send({success:false});

            }

            

        }
        else{
            return res.status(401).send({success:false});

        }

    }
    catch(err){

        return res.status(401).send({success:false});

    }

}

const requireAdminAuth=(req,res,next)=>{


    try{
        const authorization = req.headers.authorization;

        if(authorization){
    
            const accessToken = authorization.split(" ")[1];
    
            if(accessToken){
    
                const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_KEY);
    
                if(decoded&&decoded.id){
    
                    if(decoded.role==="admin"){
    
                        req.userId=decoded.id;
    
                        return next();
    
                    }
                    else{
    
                        return res.status(403).send({success:false});
    
                    }
    
    
                }
                else{

                    logger.error("",new Error("Bilinmeyen hata"));

                    return res.status(401).send({success:false});
    
                }
    
            }
            else{
    
                return res.status(401).send({success:false});
    
            }
    
        }
        else{
            return res.status(401).send({success:false});
    
        }

    }
    catch(err){
        return res.status(401).send({success:false});
    }
    

}

module.exports={requireAuth,requireAdminAuth};