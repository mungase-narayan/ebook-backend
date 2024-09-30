import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bookModel from "../../model/bookModel";
import { AuthRequest } from "../../middlewares/authenticate";
import cloudinary from "../../config/cloudinary";

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookId;
        const book = await bookModel.findOne({ _id: bookId });

        if (!book) {
            return next(createHttpError(404, "Book not found"));
        }

        // Check access
        const _req = req as AuthRequest;
        if (book.author.toString() !== _req.userId) {
            return next(createHttpError(403, "You can not delete book."));
        }

        const coverFileSplits = book.coverImage.split("/");
        const coverImagePublicId =
            coverFileSplits.at(-2) +
            "/" +
            coverFileSplits.at(-1)?.split(".").at(-2);

        const bookFileSplites = book.pdfFile.split("/");
        const bookFilePublicId =
            bookFileSplites.at(-2) + "/" + bookFileSplites.at(-1);

        // Delete cover image from cloudinary
        await cloudinary.uploader.destroy(coverImagePublicId);
        // Delete book file from cloudinary
        await cloudinary.uploader.destroy(bookFilePublicId, {
            resource_type: "raw",
        });

        // Delete book from database
        await bookModel.deleteOne({ _id: bookId });

        // Send response with success message
        return res.status(204).json({ message: "Book deleted successfully" });
    } catch (error) {
        return next(createHttpError(400, "Error while delete a book"));
    }
};
export { deleteBook };
