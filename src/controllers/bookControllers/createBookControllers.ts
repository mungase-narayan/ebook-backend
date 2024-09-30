import { NextFunction, Request, Response } from "express";
import cloudinary from "../../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import bookModel from "../../model/bookModel";
import createHttpError from "http-errors";
import { AuthRequest } from "../../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, genre, description } = req.body;

        // Destructure the files from the request (Multer is used for handling file uploads)
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        // console.log("Files :", files);

        // Check if coverImage and file exist
        const coverImage = files?.coverImage?.[0];
        const bookFile = files?.pdfFile?.[0];

        // If either the cover image or book file is missing, return an error
        if (!coverImage || !bookFile) {
            return next(
                createHttpError(400, "Cover image or book file is missing")
            );
        }

        // Extract the cover image MIME type and filename
        const coverImageMimeType = coverImage.mimetype.split("/").pop();
        const coverImageFileName = coverImage.filename;
        const coverImageFilePath = path.resolve(
            __dirname,
            "../../../public/data/uploads",
            coverImageFileName
        );

        // Upload the cover image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(
            coverImageFilePath,
            {
                filename_override: coverImageFileName,
                folder: "book-covers",
                format: coverImageMimeType,
            }
        );

        // Extract the book file name and file path
        const bookFileName = bookFile.filename;
        const bookFilePath = path.resolve(
            __dirname,
            "../../../public/data/uploads",
            bookFileName
        );

        // Upload the book PDF file to Cloudinary
        const bookFileUploadResult = await cloudinary.uploader.upload(
            bookFilePath,
            {
                resource_type: "raw",
                filename_override: bookFileName,
                folder: "book-pdfs",
                format: "pdf",
            }
        );

        // Cast the request to include the user ID
        const _req = req as AuthRequest;
        // console.log("User Id", _req.userId);

        // Create a new book entry in the database
        const newBook = await bookModel.create({
            title,
            description,
            genre,
            author: _req.userId, // Assuming req.userId is available
            coverImage: uploadResult.secure_url,
            pdfFile: bookFileUploadResult.secure_url,
        });

        // Delete the temporary files from the server after successful upload
        try {
            await fs.promises.unlink(coverImageFilePath);
            await fs.promises.unlink(bookFilePath);
            // If all operations are successful, return the new book's ID
            return res.status(201).json({ BookId: newBook._id });
        } catch (fileDeleteError) {
            return next(
                createHttpError(400, "Error while deleting temporary files")
            );
        }
    } catch (error) {
        console.log(error);
        return next(createHttpError(500, "Error While Uploading The Files"));
    }
};

export { createBook };
