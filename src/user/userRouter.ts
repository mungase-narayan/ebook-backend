import express from "express";
import { registerUser } from "../controllers/authControllers/registerControllers";
import { loginUser } from "../controllers/authControllers/loginControllers";

const userRouter = express.Router();

//Routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
