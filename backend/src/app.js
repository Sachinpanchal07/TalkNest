import express from "express"
import cors from 'cors';
import cookieParser from 'cookie-parser';
import  authRouter  from "./routes/auth.routes.js";
import userRouter from "./routes/user.route.js";
import http from 'http';
import {Server} from 'socket.io';
import chatRouter from "./routes/chat.route.js";
import {callSocket} from "./socket/socket.js"

const app = express();
const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cookieParser());
app.use(express.urlencoded({extended : true}))
app.use(express.json());

callSocket(io);

app.use(cors({
    credentials : true,
    origin : 'http://localhost:5173'
}));


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

export default httpServer;
