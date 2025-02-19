

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {logger} = require("../utils/logger");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{type:String,required:true},
    surname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,required:true,default:"user"}
});

userSchema.pre("save", async function(next){

    try{

    
    if(this.isModified("password")){
        
        const hashedPassword = await bcrypt.hash(this.password,10);

        this.password=hashedPassword;

        return next();
    }
    else{
        return next();
    }
    }
    catch(err){
        const error = new Error("Hashing sırasında hata oluştu");

        logger.error("",error);

        return next(error);

    }
});




const Users = mongoose.model("User",userSchema);



module.exports=Users;