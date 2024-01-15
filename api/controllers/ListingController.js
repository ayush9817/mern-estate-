import listing from "../model/ListingModel.js";

export const creatListing = async (req,res,next)=>{
    try {
        const slisting = await listing.create(req.body);
        res.status(201).json(slisting);
        
    } catch (error) {
        next(error);
    }
}