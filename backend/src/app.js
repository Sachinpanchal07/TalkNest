import express, { urlencoded } from "express"
import { Router } from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { signupController } from "./controllers/auth.controller.js";
import  authRouter  from "./routes/auth.routes.js";
import userRouter from "./routes/user.route.js";

const app = express();

app.use(cors({
    credentials : true,
    origin : 'http://localhost:5173'
}));

app.use(cookieParser());
app.use(express.urlencoded({extended : true}))
app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

export default app;