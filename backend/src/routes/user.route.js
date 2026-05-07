
import { Router } from "express";
import { userSearchController, usersInviteController, singleUserInviteController, reviewInviteController, getInvitesController, getConnectionsController, sentInvitesController, getAllInvitations, searchConnectionsController } from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.middleware.js";

const userRouter = Router();
userRouter.post("/search", userAuth, userSearchController);
userRouter.post("/invite-users", userAuth, usersInviteController);
userRouter.post("/invite", userAuth, singleUserInviteController);
userRouter.post("/invite/review", userAuth, reviewInviteController);
userRouter.get("/invite/received", userAuth, getInvitesController);
userRouter.get("/invite/sent", userAuth, sentInvitesController)
userRouter.get("/connections", userAuth, getConnectionsController);
userRouter.get("/invitations", userAuth, getAllInvitations);
userRouter.post("/serachConnections", userAuth, searchConnectionsController)


export default userRouter;