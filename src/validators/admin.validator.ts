import { body, param } from "express-validator";
import BaseValidator from "./base.validator";

class AdminValidator extends BaseValidator {
  public static register() {
    return [
      body("name")
        .isString()
        .withMessage("Name must be a string")
        .notEmpty()
        .withMessage("Name is required"),
      body("email")
        .isEmail()
        .withMessage("Email is invalid")
        .notEmpty()
        .withMessage("Email is required"),
      body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .notEmpty()
        .withMessage("Password is required"),
      AdminValidator.validate,
    ];
  }

  public static login() {
    return [
      body("email")
        .isEmail()
        .withMessage("Email is invalid")
        .notEmpty()
        .withMessage("Email is required"),
      body("password").notEmpty().withMessage("Password is required"),
      AdminValidator.validate,
    ];
  }

  public static editUser() {
    return [
      body("name").optional().isString().withMessage("Name must be a string"),
      body("email").optional().isEmail().withMessage("Invalid email format"),
      body("role").optional().isMongoId().withMessage("Invalid role ID format"),
      AdminValidator.validate,
    ];
  }

  public static changePassword() {
    return [
      body("currentPassword")
        .isString()
        .withMessage("Current password must be a string")
        .notEmpty()
        .withMessage("Current password is required"),
      body("newPassword")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters long")
        .notEmpty()
        .withMessage("New password is required"),
      AdminValidator.validate,
    ];
  }

  public static forgotPassword() {
    return [
      body("email")
        .isEmail()
        .withMessage("Please provide a valid email address"),
      AdminValidator.validate,
    ];
  }

  public static resetPassword() {
    return [
      body("token").notEmpty().withMessage("Token is required"),
      body("newPassword")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
      AdminValidator.validate,
    ];
  }

  public static updateUser() {
    return [
      param("userId").isMongoId().withMessage("Invalid user ID format"),
      body("name").optional().isString().withMessage("Name must be a string"),
      body("email").optional().isEmail().withMessage("Valid email is required"),
      body("password")
        .optional()
        .isString()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
      AdminValidator.validate,
    ];
  }
}

export default AdminValidator;
