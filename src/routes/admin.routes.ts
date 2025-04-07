import { Router } from "express";
import AdminController from "../controllers/admin.controller";
import UserValidator from "../validators/admin.validator";
import AuthMiddleware from "../middleware/auth.middleware";

const router = Router();
const adminController = new AdminController();

//! This API is not accescble to anyone

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Login a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/login", AuthMiddleware.authenticate, UserValidator.login(), adminController.login);

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", AuthMiddleware.authenticate, adminController.getUsers);

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", UserValidator.register(), adminController.register);

router.post("/refreshToken", adminController.refreshToken);
router
  .route("/me")
  .get(AuthMiddleware.authenticate, adminController.getProfile)
  .put(
    AuthMiddleware.authenticate,
    UserValidator.editUser(),
    adminController.editUser
  );
router.post("/create", AuthMiddleware.authenticate, adminController.createUser);
router.put(
  "/update/:userId",
  AuthMiddleware.authenticate,
  UserValidator.updateUser(),
  adminController.updateUser
);
router.post("/logout", AuthMiddleware.authenticate, adminController.logout);
router.post(
  "/changePassword",
  AuthMiddleware.authenticate,
  UserValidator.changePassword(),
  adminController.changePassword
);
router.post(
  "/forgotPassword",
  UserValidator.forgotPassword(),
  adminController.forgotPassword
);
router.post(
  "/resetPassword",
  UserValidator.resetPassword(),
  adminController.resetPassword
);

export default router;