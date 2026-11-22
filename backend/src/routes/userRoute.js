import { Router } from "express";
import { createNewAccount, login } from "../controllers/userController.js";

export const userRouter = Router();

userRouter.post("/register", createNewAccount);
userRouter.post("/login", login)