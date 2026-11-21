import { Router } from "express";
import { createNewAccount } from "../controllers/userController.js";

export const userRouter = Router();

userRouter.post("/register", createNewAccount)