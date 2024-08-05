import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import bookModel from "../model/bookModel";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre } = req.body;
    console.log("files :", req.files);

    const files = req.files as { [filename: string]: Express.Multer.File[] };
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        fileName
    );

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: "book-covers",
            format: coverImageMimeType,
        });

        const bookFileName = files.pdfFile[0].filename;
        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/uploads",
            bookFileName
        );

        const bookFileUploadResult = await cloudinary.uploader.upload(
            bookFilePath,
            {
                resource_type: "raw",
                filename_override: bookFileName,
                folder: "book-pdfs",
                format: "pdf",
            }
        );
        console.log("cover image upload result", uploadResult);
        console.log("book file upload result", bookFileUploadResult);

        const newBook = await bookModel.create({
            title,
            genre,
            auther: "66ae2af45c9e0b7f45d6b092",
            coverImage: uploadResult.secure_url,
            pdfFile: bookFileUploadResult.secure_url,
        });

        // wrap in the try catch
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);

        res.status(201).json({id: newBook._id});
    } catch (error) {
        console.log("Error uploading book file", error);
        return next(createHttpError(500, "Error While Uploading The Files"));
    }
};

export { createBook };
