const {body,validationResult} = require("express-validator");


const validateSignup=[
    body("email")
    .isEmail()
    .normalizeEmail(),

    body("password").isString()
    .isLength({min:8}),
    
    body("passwordAgain").custom((value,{req})=>{

        if(value!==req.body.password){
            throw new Error("Şifreleriniz eşleşmiyor")
        }else{
            return true;
        }
       


    }),

    body("name").isString().notEmpty(),
    body("surname").isString().notEmpty(),
    

    
    (req,res,next)=>{const errors = validationResult(req); if(errors.isEmpty()){next();} else{ return res.status(400).send({success:false,errorType:"ValidationError",message:"Lütfen tüm alanları geçerli değerlerle doldurunuz"});}},
  


]



const validateSignin =[
    
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({min:8}).withMessage("Şifreniz en az 8 haneli olmalı"),
    (req,res,next)=>{const errors =validationResult(req); if(errors.isEmpty()){next();} else{return res.status(400).send({success:false,errorType:"ValidationError",message:"Lütfen geçerli email veya şifre giriniz"});}}
    
]


module.exports={validateSignup,validateSignin};








