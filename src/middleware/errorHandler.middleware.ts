import { Request, Response, NextFunction } from "express";
import ResponseHandler from "../utils/responseHandler";

class ErrorHandlerMiddleware {
  public static handleErrors(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    ResponseHandler.error(res, err.message, err.stack, statusCode);
  }
}

export default ErrorHandlerMiddleware;
