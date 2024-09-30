import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bookModel from "../../model/bookModel";

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Todo : Add Pagination
        const books = await bookModel.find()
        res.json({books})
    } catch (error) {
        return next(createHttpError(400, "Error while getting list of books"))
    }
}

export { listBooks };