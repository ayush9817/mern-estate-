import express from 'express';
import { google, signOut, signin, signup } from '../controllers/AuthController.js';

const aurouter = express.Router();

aurouter.post("/signup",signup);
aurouter.post("/signin",signin);
aurouter.post("/google",google);
aurouter.get("/signout",signOut)


export default aurouter;