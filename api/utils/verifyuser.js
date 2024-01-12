import { errorHandler } from "./error.js";
import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyuser = (req,res,next)=>{
    const token = req.cookies.access_token;
    console.log("token",token);
    if(!token){
        return next(errorHandler(401,"unauthorized"))
    }
    jwt.verify(token,process.env.JWT_SECRETKEY,(err,user)=>{
        console.log("err",err);
        if(err){
            return next(errorHandler(401,"unauthorized"));
        }
        req.user = user;
        next();
    })
}