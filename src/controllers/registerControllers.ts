import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "../model/userModel";
import bcrypt from "bcrypt";
import Joi from "joi";
import { config } from "../config/config";
import JwtService from "../services/jwtService";
import RefreshToken from "../model/refreshToken";

const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //Validations

    const registerSchema = Joi.object({
        fullName: Joi.string().min(4).max(30).required(),
        userName: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .required(),
        confirmPassword: Joi.ref("password"),
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
        return next(error);
    }

    //Database call
    try {
        const exist = await userModel.findOne({ email: req.body.email });

        if (exist) {
            const error = createHttpError(400, "Email already exists");
            return next(error);
        }
    } catch (err) {
        return next(err);
    }

    const { fullName, userName, email, password } = req.body;

    //Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create user
    const newUser = new userModel({
        fullName,
        userName,
        email,
        password: hashedPassword,
    });

    let access_token: string;
    let refresh_token: string;
    try {
        const result = await newUser.save();
        console.log("result :: ", result);

        // token
        access_token = await JwtService.sign({
            id: result._id,
            role: result.role,
        });
        refresh_token = await JwtService.sign(
            { id: result._id, role: result.role },
            "1y",
            config.refreshSecret
        );

        //Database whitelist
        await RefreshToken.create({ token: refresh_token });
    } catch (error) {
        console.error(error);
        return next(error);
    }

    return res
        .status(201)
        .json({ access_token: access_token, refresh_token: refresh_token });
};

export { registerUser };
