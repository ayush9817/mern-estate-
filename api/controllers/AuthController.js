import user from "../model/UserModel.js";
import bcryptjs from 'bcryptjs'

export const signup = async(req,res)=>{
    const {username,email,password}=req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newuser = new user({username,email,password : hashedPassword});
    try {
        await newuser.save();
        res.status(201).json('user created success');        
    } catch (error) {
        console.log(error.message);
    }
    
    
}