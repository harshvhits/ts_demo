import { Request, Response, NextFunction } from "express";
import ResponseHandler from "../utils/responseHandler";
import JWT from "../utils/jwt";
import { config } from "../config/config";

class AuthMiddleware {
  public static authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return ResponseHandler.error(
        res,
        "Access denied. No token provided.",
        null,
        401
      );
    }

    const decoded = JWT.verifyToken(token, config.jwtAccessSecret);

    if (!decoded) {
      return ResponseHandler.error(res, "Invalid token.", null, 401);
    }

    req.user = decoded;
    next();
  }
}

export default AuthMiddleware;
