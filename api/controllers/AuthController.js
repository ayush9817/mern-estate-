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

export const google = async  (req,res,next)=>{
    try {
        const userg = await user.findOne({email:req.body.email});
        if(userg){
            const token = await jwt.sign({id:userg._id},process.env.JWT_SECRETKEY);
            const {password:pass,...rest}= userg._doc;
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);

        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
            const newUser = new user(
                {
                    username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),
                    email:req.body.email,
                    password:hashedPassword,
                    avatar:req.body.photo
                }
            )
            await newUser.save();
            const token = await jwt.sign({id:userg_id},process.env.JWT_SECRETKEY);
            const {password:pass,...rest}= newUser._doc;
            res.cookie("access_token",token,{httpOnly:true}).stus(200).json(newUser);

        }
    } catch (error) {
        console.log(error);
    }

}