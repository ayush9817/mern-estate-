import listing from "../model/ListingModel.js";
import user from "../model/UserModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'

export const test = (req,res)=>{
    res.json({msg:"hello world"});
}
export const updateUser = async (req,res,next)=>{
     if(req.user.id !== req.params.id) return next(errorHandler(401,"you can only update your account"))
     try {
       if(req.body.password){
           req.body.password = bcryptjs.hashSync(req.body.password,10)
       }

       const updateduser = await  user.findByIdAndUpdate(req.params.id,{ $set:{  
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        avatar : req.body.avatar
       }},{new:true})

       const {password,...rest} = updateduser._doc;

       res.status(200).json(rest);
        
     } catch (error) {
        next(error);
     }
}
export const deleteUser = async (req,res,next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,"you can only delete your account"));
    try {
        await user.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("User has been deleted");
    } catch (error) {
        next(error);
    }
}

export const getUserListings = async (req,res,next)=>{
    if(req.user.id !== req.params.id){
        return next(errorHandler(401,'You can only view your own listing!'));
    }
    try{
        const listingsUser = await listing.find({userRef:req.params.id});
        res.status(200).json(listingsUser);
    }catch(error){
        console.log(error);
    }
}