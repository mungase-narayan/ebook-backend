import { NextFunction, Request, Response } from "express";
import bookModel from "../../model/bookModel";
import createHttpError from "http-errors";
import { AuthRequest } from "../../middlewares/authenticate";

import fs from "node:fs";
import path from "node:path";
import cloudinary from "../../config/cloudinary";

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, genre } = req.body;
        const bookId = req.params.bookId;

        const book = await bookModel.findOne({ _id: bookId });

        if (!book) {
            return next(createHttpError(404, "Book not found"));
        }
        // Check access
        const _req = req as AuthRequest;
        if (book.author.toString() !== _req.userId) {
            return next(
                createHttpError(403, "You can not update others book.")
            );
        }

        // check if image field is exists.

        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };
        let completeCoverImage = "";
        if (files.coverImage) {
            const filename = files.coverImage[0].filename;
            const converMimeType = files.coverImage[0].mimetype
                .split("/")
                .at(-1);
            // send files to cloudinary
            const filePath = path.resolve(
                __dirname,
                "../../../public/data/uploads/" + filename
            );
            completeCoverImage = filename;
            const uploadResult = await cloudinary.uploader.upload(filePath, {
                filename_override: completeCoverImage,
                folder: "book-covers",
                format: converMimeType,
            });

            completeCoverImage = uploadResult.secure_url;
            await fs.promises.unlink(filePath);
        }

        // check if file field is exists.
        let completeFileName = "";
        if (files.file) {
            const bookFilePath = path.resolve(
                __dirname,
                "../../../public/data/uploads/" + files.file[0].filename
            );

            const bookFileName = files.file[0].filename;
            completeFileName = bookFileName;

            const uploadResultPdf = await cloudinary.uploader.upload(
                bookFilePath,
                {
                    resource_type: "raw",
                    filename_override: completeFileName,
                    folder: "book-pdfs",
                    format: "pdf",
                }
            );

            completeFileName = uploadResultPdf.secure_url;
            await fs.promises.unlink(bookFilePath);
        }

        const updatedBook = await bookModel.findOneAndUpdate(
            {
                _id: bookId,
            },
            {
                title: title,
                description: description,
                genre: genre,
                coverImage: completeCoverImage
                    ? completeCoverImage
                    : book.coverImage,
                file: completeFileName ? completeFileName : book.pdfFile,
            },
            { new: true }
        );
        res.json(updatedBook);
    } catch (error) {
        console.log(error);
        next(createHttpError(500, "Server Error"));
    }
};

export { updateBook };
