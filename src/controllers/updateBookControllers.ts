import { NextFunction, Request, Response } from "express";
import bookModel from "../model/bookModel";
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";


import fs from "node:fs";
import path from "node:path";
import cloudinary from "../config/cloudinary";
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre } = req.body;
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
        return next(createHttpError(404, "Book not found"));
    }

    //check access
    const _req = req as AuthRequest;
    if (book.author.toString() != _req.userId) {
        return next(createHttpError(403, "You can not update other book"));
    }

    const files = req.files as { [filename: string]: Express.Multer.File[] };
    let completeCoverImage = "";
    if (files.coverImage) {
        const filename = files.coverImage[0].filename;
        const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);

        // Sent file to cloudinary
        const filePath = path.resolve(
            __dirname,
            "../../public/data/uploads" + filename
        );

        completeCoverImage = filename;
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: completeCoverImage,
            folder: "book-covers",
        });

        completeCoverImage = uploadResult.secure_url;
        await fs.promises.unlink(filePath);
    }

    let completeFileName = "";
    if (files.pdfFile) {
        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/uploads" + files.pdfFile[0].filename
        );

        const bookFileName = files.pdfFile[0].filename;
        completeFileName = bookFileName;

        const bookFileUploadResult = await cloudinary.uploader.upload(
            bookFilePath,
            {
                resource_type: "raw",
                filename_override: bookFileName,
                folder: "book-pdfs",
                format: "pdf",
            }
        );

        completeFileName = bookFileUploadResult.secure_url;
        await fs.promises.unlink(bookFilePath);
    }
    const updateBook = await bookModel.findOneAndUpdate(
        {
            _id: bookId,
        },
        {
            title,
            genre,
            coverImage: completeCoverImage
                ? completeCoverImage
                : book.coverImage,
            pdfFile: completeFileName ? completeFileName : book.pdfFile,
        },
        {
            new: true,
        }
    );
    res.json(updateBook);
};

export { updateBook };
