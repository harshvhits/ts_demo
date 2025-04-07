import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/config";

export interface ITokenPayload {
  id: string;
  email: string;
}

class JWT {
  private static generateToken(
    payload: ITokenPayload,
    secret: string,
    expiresIn: string | number
  ): string {
    const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] }; // Ensuring correct type
    return jwt.sign(payload, secret, options);
  }

  public static generateAccessToken(payload: ITokenPayload): string {
    return this.generateToken(payload, config.jwtAccessSecret, "1d");
  }

  public static generateRefreshToken(payload: ITokenPayload): string {
    return this.generateToken(payload, config.jwtRefreshSecret, "7d");
  }

  public static verifyToken(
    token: string,
    secret: string
  ): ITokenPayload | null {
    try {
      return jwt.verify(token, secret) as ITokenPayload;
    } catch (error) {
      return null;
    }
  }
}

export default JWT;
