import { Date } from "mongoose";
import { User } from "./userTypes"

export interface Book {
    _id: string;
    title: string;
    author: User;
    genre: string;
    coverImage: string;
    pdfFile: string;
    createdAt: Date;
    updatedAt: Date;
}