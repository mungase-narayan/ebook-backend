import express from "express";
import { registerUser } from "../controllers/registerControllers";
import { loginUser } from "../controllers/loginControllers";

const userRouter = express.Router();

//Routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
