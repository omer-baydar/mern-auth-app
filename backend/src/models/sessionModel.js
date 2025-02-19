const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionSchema = new Schema({

    userId:{type:String,required:true},
    hashedRefreshToken:{type:String,required:true,unique:true},
    sessionId:{type:String,required:true,unique:true}, //session id aynı zamanda refreshtoken içerisindede mevcut böylelikle race-conditionı önlemeyi amaçlıyorum.
    deviceId:{type:String,required:true,unique:true}, 
    createdAt:{type:Date,required:true,default:Date.now}

});

const Sessions = mongoose.model("Session",sessionSchema);

module.exports=Sessions;