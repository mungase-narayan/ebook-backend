import express from "express";
import { createBook } from "../controllers/bookControllers/createBookControllers";
import { updateBook } from "../controllers/bookControllers/updateBookControllers";
import { listBooks } from "../controllers/bookControllers/listBooksControllers"
import upload from "./upload";
import authenticate from "../middlewares/authenticate";
import { getSingleBook } from "../controllers/bookControllers/getSingleBookControllers";

const bookRouter = express.Router();

bookRouter.post("/create-book", authenticate, upload.fields([
    {name: "coverImage", maxCount: 1},
    {name: "pdfFile", maxCount: 1}
]), createBook);

bookRouter.patch("/:bookId", authenticate, upload.fields([
    {name: "coverImage", maxCount: 1},
    {name: "pdfFile", maxCount: 1}
]), updateBook);

bookRouter.get("/", listBooks)
bookRouter.get("/:bookId", getSingleBook)

export default bookRouter;