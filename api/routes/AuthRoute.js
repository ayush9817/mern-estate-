import express from 'express';
import { signin, signup } from '../controllers/AuthController.js';

const aurouter = express.Router();

aurouter.post("/signup",signup);
aurouter.post("/signin",signin);

export default aurouter;