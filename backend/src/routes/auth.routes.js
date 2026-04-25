import { Router } from "express";
import { loginController } from "../controllers/auth.controller.js";
import { signupController } from "../controllers/auth.controller.js";

const authRouter = Router();
// authRouter.get("/login", loginForm)
authRouter.post("/login", loginController);
authRouter.post("/signup", signupController);



export default authRouter;