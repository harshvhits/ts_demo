import crypto from "crypto";
import Admin, { IAdmin } from "../models/admin.model";

class UserService {
  public async createUser(admin: IAdmin): Promise<IAdmin> {
    const newUser = new Admin(admin);
    return await newUser.save();
  }

  public async getAllUsers(): Promise<IAdmin[]> {
    return await Admin.find();
  }

  public async getUserById(id: string): Promise<IAdmin | null> {
    return await Admin.findById(id).select("-password");
  }

  public async updateUser(
    id: string,
    admin: Partial<IAdmin>
  ): Promise<IAdmin | null> {
    return await Admin.findByIdAndUpdate(id, admin, { new: true });
  }

  public async deleteUser(id: string): Promise<IAdmin | null> {
    return await Admin.findByIdAndDelete(id);
  }

  public async generatePasswordResetToken(
    email: string
  ): Promise<IAdmin | null> {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return null;
    }

    const token = crypto.randomBytes(20).toString("hex");
    admin.passwordResetToken = token;
    admin.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await admin.save();
    return admin;
  }

  public async getUserByPasswordResetToken(
    token: string
  ): Promise<IAdmin | null> {
    return await Admin.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }, // Ensure token is not expired
    });
  }

  public async resetPassword(
    token: string,
    newPassword: string
  ): Promise<IAdmin | null> {
    const admin = await this.getUserByPasswordResetToken(token);
    if (!admin) {
      return null;
    }

    admin.password = newPassword; // Ensure to hash password before saving
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;

    await admin.save();
    return admin;
  }
}

export default UserService;
