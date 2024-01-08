import express from 'express';
import { signup } from '../controllers/AuthController.js';

const aurouter = express.Router();

aurouter.post("/signup",signup)

export default aurouter;