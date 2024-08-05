import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./user/bookRouter";

const app = express();
app.use(express.json());

//Routes
//Http Methods : GET, POST, PUT, DELETE, PATCH
app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to ebook api :" });
});

app.use("/api/auth", userRouter);
app.use("/api/books", bookRouter);
app.use(globalErrorHandler);

export default app;
