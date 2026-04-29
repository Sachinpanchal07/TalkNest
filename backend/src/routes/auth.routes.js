import { Router } from "express";
import { signupController, logoutController, loginController } from "../controllers/auth.controller.js";

const authRouter = Router();
// authRouter.get("/login", loginForm)
authRouter.post("/login", loginController);
authRouter.post("/signup", signupController);
authRouter.get("/logout", logoutController);




export default authRouter;