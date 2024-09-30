import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors"
import bookModel from "../../model/bookModel";

const getSingleBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookId;
        const book = await bookModel.findById({_id: bookId})

        if (!book) {
            return next(createHttpError(404, "Book not found"))
        }

        res.json({ book })
    } catch (error) {
        return next(createHttpError(500, "Error while getting a single book"))
    }
}

export { getSingleBook }