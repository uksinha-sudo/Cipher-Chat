import { Router } from "express";
import { createNewAccount, getUser, login, logout } from "../controllers/userController.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";

export const userRouter = Router();

userRouter.post("/register", createNewAccount);
userRouter.post("/login", login);
userRouter.post("/logout", verifyAuth, logout);
userRouter.get("/user", verifyAuth, getUser)