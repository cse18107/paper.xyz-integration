const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fetch = require("node-fetch");
const tokenRouter= require('./routes/token.routes');

dotenv.config({ path: "./config/.env" });

const app = express();



app.use(cors());
app.use(express.json());



app.use("/api",tokenRouter) ;
app.use('/',(req,res)=>{
  res.status(200).json({
    message:"working"
  })
});

module.exports = app;
