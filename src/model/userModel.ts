import mongoose from "mongoose";
import { User } from "../types/userTypes";

const userSchema = new mongoose.Schema<User>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        books: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "book",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model<User>("User", userSchema);
