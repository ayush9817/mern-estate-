import express from 'express';
import { deleteUser, getUserListings, test, updateUser } from '../controllers/UserController.js';
import { verifyuser } from '../utils/verifyuser.js';

const arouter = express.Router();

arouter.get("/test",test)
arouter.post("/update/:id",verifyuser,updateUser)
arouter.delete("/delete/:id",verifyuser,deleteUser)
arouter.get('/listings/:id',verifyuser,getUserListings)

export default arouter;