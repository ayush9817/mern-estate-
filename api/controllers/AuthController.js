import user from "../model/UserModel.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";


dotenv.config();

export const signup = async(req,res,next)=>{
    
    try {
        const {username,email,password}=req.body;
        const hashedPassword = bcryptjs.hashSync(password,10);
        const newuser = new user({username,email,password : hashedPassword});
        await newuser.save();
        res.status(201).json('user created success');        
    } catch (error) {
        next(error)
    } 
}

export const signin = async (req,res,next)=>{
    const {email,password} = req.body;
    try{
           const validuser = await user.findOne({email});
           if(!validuser){
            return next(errorHandler(401,"user not found"));
           }
           const validPassword = bcryptjs.compareSync(password,validuser.password);
           if(!validPassword){
             return next(errorHandler(401,"Invalid Cred"))
           }
           const token = jwt.sign({id:validuser._id},process.env.JWT_SECRETKEY);
           const {password:pass,...rest} = validuser._doc;
           res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
    }
    catch(error){
        next(error);
    }
}