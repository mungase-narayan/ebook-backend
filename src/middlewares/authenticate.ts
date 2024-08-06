import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import createHttpError from "http-errors";
import { config } from "../config/config";

export interface AuthRequest extends Request {
    userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");
    if (!token) {
        return next(createHttpError(401, "Authorization Token Is Required"));
    }

    try {
        const parsedToken = token.split(" ")[1];
        const decoded = verify(parsedToken, config.jwtSecret as string);
        // console.log("Decoded token :", decoded);

        const _req = req as AuthRequest;
        _req.userId = decoded.sub as string;
        next();
    } catch (error) {
        return next(createHttpError(403, "Invalid or Expired Token"));
    }
};

export default authenticate;
