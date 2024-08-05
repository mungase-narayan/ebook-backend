import mongoose from "mongoose";
import { Book } from "../types/bookTypes";

const bookSchema = new mongoose.Schema<Book>({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    coverImage: {
        type: String,
        required: true
    },
    pdfFile: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    }

}, {timestamps: true});

export default mongoose.model<Book>('Book', bookSchema);