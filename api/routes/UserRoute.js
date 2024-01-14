import express from 'express';
import { deleteUser, test, updateUser } from '../controllers/UserController.js';
import { verifyuser } from '../utils/verifyuser.js';

const arouter = express.Router();

arouter.get("/test",test)
arouter.post("/update/:id",verifyuser,updateUser)
arouter.delete("/delete/:id",verifyuser,deleteUser)

export default arouter;