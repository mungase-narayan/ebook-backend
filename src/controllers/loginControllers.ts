import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import userModel from "../model/userModel";
import customErrorHandler from "../services/customErrorHandler";
import bcrypt from "bcrypt";
import JwtService from "../services/jwtService";
import RefreshToken from "../model/refreshToken";
import { config } from "../config/config";

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .required(),
    });

    const { error } = loginSchema.validate(req.body);
    if (error) {
        return next(error);
    }

    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return next(customErrorHandler.wrongCredentials());
        }

        // Compare the password
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return next(customErrorHandler.wrongCredentials());
        }

        const access_token = await JwtService.sign({
            id: user._id,
            role: user.role,
        });
        const refresh_token = await JwtService.sign(
            { id: user._id, role: user.role },
            "1y",
            config.refreshSecret
        );

        //Database whitelist
        await RefreshToken.create({ token: refresh_token });
        res.json({
            access_token: access_token,
            refresh_token: refresh_token,
        });
    } catch (error) {
        return next(error);
    }
};

export { loginUser };
