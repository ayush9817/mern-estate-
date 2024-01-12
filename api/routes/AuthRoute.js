import express from 'express';
import { google, signin, signup } from '../controllers/AuthController.js';

const aurouter = express.Router();

aurouter.post("/signup",signup);
aurouter.post("/signin",signin);
aurouter.post("/google",google)


export default aurouter;