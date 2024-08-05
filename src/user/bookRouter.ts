import express from "express";
import { createBook } from "../controllers/createBookControllers";
import upload from "./upload";

const bookRouter = express.Router();

bookRouter.post("/create-book",upload.fields([
    {name: "coverImage", maxCount: 1},
    {name: "pdfFile", maxCount: 1}
]), createBook);

export default bookRouter;