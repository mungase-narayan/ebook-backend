import { Book } from "./bookTypes";

export interface User {
    _id: string;
    fullName: string;
    userName: string;
    email: string;
    password: string;
    role: string;
    books: Book[];
    confirmPassword: string;
}