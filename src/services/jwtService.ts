type TPayload = {
  id: string;
  role: string;
};

import { config } from "../config/config";
import jwt from "jsonwebtoken";

class JwtService {
  static sign(
    payload: TPayload,
    expiry: string = "7days",
    secret: string = config.jwtSecret!
  ) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }

  static veryfyToken(token: string, secret: string = config.jwtSecret!) {
    return jwt.verify(token, secret);
  }
}

export default JwtService