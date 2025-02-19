const express = require("express");

const Router = express.Router();

const {refreshTokens} = require("../controllers/authController");

Router.post("/refresh",refreshTokens);


module.exports=Router;