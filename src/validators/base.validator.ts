import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

class BaseValidator {
  // Common method to handle validation results
  protected static validate(
    req: Request,
    res: Response,
    next: NextFunction
  ): any {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0]?.msg,
        errors: errors.array(),
      });
    }
    next();
  }
}

export default BaseValidator;
