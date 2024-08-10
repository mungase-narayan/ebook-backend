import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import bookModel from "../model/bookModel";
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, genre } = req.body;

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

        const _req = req as AuthRequest;
        console.log(_req.userId);
        //66b21b5437cee6ac2e8091d0

        const newBook = await bookModel.create({
            title,
            genre,
            auther: _req.userId,
            coverImage: uploadResult.secure_url,
            pdfFile: bookFileUploadResult.secure_url,
        });

        console.log(newBook);

        // task: wrap in the try catch
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);

        res.status(201).json({ id: newBook._id });
    } catch (error) {
        console.log("Error uploading book file", error);
        return next(createHttpError(500, "Error While Uploading The Files"));
    }
};

export { createBook };
