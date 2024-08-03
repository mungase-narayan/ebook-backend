import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";

const app = express();
app.use(express.json());

//Routes
//Http Methods : GET, POST, PUT, DELETE, PATCH
app.get("/", (req, res, next) => {

  res.json({ message: "Welcome to ebook api :" });
});

app.use("/api/auth", userRouter);
app.use(globalErrorHandler);

export default app;
