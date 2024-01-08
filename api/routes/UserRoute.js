import express from 'express';
import { test } from '../controllers/UserController.js';

const arouter = express.Router();

arouter.get("/test",test)

export default arouter;