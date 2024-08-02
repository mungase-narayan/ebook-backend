import express from "express";

const app = express();

//Routes
//Http Methods : GET, POST, PUT, DELETE, PATCH
app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to ebook api :" });
});

export default app;
