
const express = require("express");

const {login,register,logout} = require("../controllers/userController");

const {validateSignup,validateSignin} = require("../middlewares/validation");

const { requireAuth } = require("../middlewares/requireAuth");

const Router = express.Router();

Router.post("/login",validateSignin,login);

Router.post("/register",validateSignup,register);

Router.post("/logout",requireAuth,logout);


module.exports=Router;