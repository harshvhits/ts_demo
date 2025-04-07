import { body, param } from "express-validator";
import BaseValidator from "./base.validator";

class PermissionValidator extends BaseValidator {
  // Validation for creating a permission
  public static createPermission() {
    return [
      body("module")
        .isString()
        .withMessage("Module must be a string")
        .notEmpty()
        .withMessage("Module is required"),
      PermissionValidator.validate,
    ];
  }

  // Validation for updating a permission
  public static updatePermission() {
    return [
      param("id").isMongoId().withMessage("Invalid permission ID format"),
      body("module")
        .optional()
        .isString()
        .withMessage("Module must be a string"),
      PermissionValidator.validate,
    ];
  }

  // Validation for deleting a permission
  public static deletePermission() {
    return [
      param("id").isMongoId().withMessage("Invalid permission ID format"),
      PermissionValidator.validate,
    ];
  }

  // Validation for getting a permission by ID
  public static getPermissionById() {
    return [
      param("id").isMongoId().withMessage("Invalid permission ID format"),
      PermissionValidator.validate,
    ];
  }
}

export default PermissionValidator;
