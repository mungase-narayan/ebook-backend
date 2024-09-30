import { NextFunction, Request, Response } from "express";
import RefreshToken from "../../model/refreshToken";
import Joi from "joi";

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    // CheckList
    // [] validate the request
    // [] authorize the request
    // [] remove refresh token from database
    // [] send the response

    const refreshSchema = Joi.object({
        refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    if (error) {
        return next(error);
    }

    try {
        await RefreshToken.deleteOne({ token: req.body.refresh_token });
    } catch (err) {
        return next(new Error("Something went wrong in the database"));
    }
    res.json({ message: "Logged out successfully" });
};

export { logoutUser };
