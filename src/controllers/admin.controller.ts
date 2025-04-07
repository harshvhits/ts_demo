import { Request, Response } from "express";
import UserService from "../services/admin.service";
import AuthService from "../services/auth.service";
import ResponseHandler from "../utils/responseHandler";
import User from "../models/admin.model";
import EmailService from "../utils/emailService";

class UserController {
  private userService: UserService;
  private authService: AuthService;
  private emailService: EmailService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
    this.emailService = new EmailService();
  }

  // this only used for create admin. (only for dev use)
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.userService.createUser(req.body);
      ResponseHandler.created(res, "User added successfully");
    } catch (error) {
      ResponseHandler.error(res, "Registration failed", error);
    }
  };

  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.userService.createUser(req.body);
      ResponseHandler.created(res, "User created successfully");
    } catch (error) {
      ResponseHandler.error(res, "User creation failed", error);
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return ResponseHandler.error(
          res,
          "Invalid email or password",
          null,
          400
        );
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return ResponseHandler.error(
          res,
          "Invalid email or password",
          null,
          400
        );
      }

      const tokens = await this.authService.generateTokens(user);
      ResponseHandler.success(res, "Login successful", tokens);
    } catch (error) {
      ResponseHandler.error(res, "Login failed", error);
    }
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.authService.refreshAccessToken(refreshToken);

      if (!tokens) {
        return ResponseHandler.error(res, "Invalid refresh token", null, 401);
      }

      ResponseHandler.success(
        res,
        "Access token refreshed successfully",
        tokens
      );
    } catch (error) {
      ResponseHandler.error(res, "Failed to refresh access token", error);
    }
  };

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.getUserById(req.user!.id);
      if (!user) {
        return ResponseHandler.error(res, "User not found", null, 404);
      }
      ResponseHandler.success(res, "User profile retrieved successfully", user);
    } catch (error) {
      ResponseHandler.error(res, "Failed to retrieve user profile", error);
    }
  };

  public getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      ResponseHandler.success(res, "Users retrieved successfully", users);
    } catch (error) {
      ResponseHandler.error(res, "Failed to retrieve users", error);
    }
  };

  public changePassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.id; // Assuming user ID is set in the request object

      if (!userId) {
        return ResponseHandler.error(res, "User not authenticated", null, 401);
      }

      const user = await User.findById(userId);
      if (!user) {
        return ResponseHandler.error(res, "User not found", null, 404);
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return ResponseHandler.error(
          res,
          "Current password is incorrect",
          null,
          400
        );
      }

      user.password = newPassword;
      await user.save();

      // Invalidate old tokens
      await this.authService.invalidateUserTokens(userId);

      ResponseHandler.success(res, "Password changed successfully");
    } catch (error) {
      ResponseHandler.error(res, "Password change failed", error);
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      await this.authService.revokeRefreshToken(refreshToken);
      ResponseHandler.success(res, "Logged out successfully");
    } catch (error) {
      ResponseHandler.error(res, "Logout failed", error);
    }
  };

  public forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email } = req.body;
      const user = await this.userService.generatePasswordResetToken(email);

      if (!user) {
        return ResponseHandler.error(
          res,
          "User with this email does not exist",
          null,
          404
        );
      }

      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.passwordResetToken!
      );
      ResponseHandler.success(res, "Password reset email sent successfully");
    } catch (error) {
      ResponseHandler.error(res, "Failed to send password reset email", error);
    }
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      const user = await this.userService.resetPassword(token, newPassword);

      if (!user) {
        return ResponseHandler.error(
          res,
          "Invalid or expired reset token",
          null,
          400
        );
      }

      ResponseHandler.success(res, "Password reset successfully");
    } catch (error) {
      ResponseHandler.error(res, "Failed to reset password", error);
    }
  };

  public editUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { name, email } = req.body;

      console.log({ userId });
      const user = await this.userService.getUserById(userId);

      if (!user) {
        return ResponseHandler.error(res, "User not found", null, 404);
      }

      if (name) user.name = name;
      if (email) user.email = email;

      await user.save();

      ResponseHandler.success(res, "User updated successfully");
    } catch (error) {
      ResponseHandler.error(res, "Failed to update user", error);
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { name, email, role: roleId, password } = req.body;

      // Ensure the user exists
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return ResponseHandler.error(res, "User not found", null, 404);
      }

      // Check if updating role and make sure it's not root

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) {
        user.password = password;
        await this.authService.invalidateUserTokens(userId);
      }

      await user.save();

      ResponseHandler.success(res, "User updated successfully");
    } catch (error) {
      ResponseHandler.error(res, "User update failed", error);
    }
  };
}

export default UserController;
