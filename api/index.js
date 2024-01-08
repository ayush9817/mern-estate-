import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import arouter from './routes/UserRoute.js';
import aurouter from './routes/AuthRoute.js';


dotenv.config();

const app = express();



mongoose.connect(process.env.MONGO).then(()=>{
    console.log("coonected to mongodb");
}).catch((err)=>{
    console.log(err);
})


app.listen(3000,()=>{
    console.log("Server is listening on port 3000")
})

app.use(express.json());
app.use("/api/user",arouter);
app.use("/api/auth",aurouter);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message,
    })
})