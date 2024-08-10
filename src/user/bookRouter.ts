import express from "express";
import { createBook } from "../controllers/createBookControllers";
import { updateBook } from "../controllers/updateBookControllers";
import upload from "./upload";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router();

bookRouter.post("/create-book", authenticate, upload.fields([
    {name: "coverImage", maxCount: 1},
    {name: "pdfFile", maxCount: 1}
]), createBook);

bookRouter.patch("/update/:bookId", authenticate, upload.fields([
    {name: "coverImage", maxCount: 1},
    {name: "pdfFile", maxCount: 1}
]), updateBook);

export default bookRouter;