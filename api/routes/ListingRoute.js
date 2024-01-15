import  express  from "express";
import { creatListing } from "../controllers/ListingController.js";
import { verifyuser } from "../utils/verifyuser.js";

const lrouter = express.Router();

lrouter.post('/create',verifyuser,creatListing);


export default lrouter;