import JWT from "../utils/jwt";
import User from "../models/admin.model";
import RefreshToken from "../models/refreshToken.model";
import { ITokenPayload } from "../utils/jwt";
import { config } from "../config/config";

class AuthService {
  public async generateTokens(
    user: any
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: ITokenPayload = { id: user.id, email: user.email };
    const accessToken = JWT.generateAccessToken(payload);
    const refreshToken = JWT.generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  public async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string } | null> {
    const decoded = JWT.verifyToken(refreshToken, config.jwtRefreshSecret);

    if (!decoded) {
      return null;
    }

    const tokenDoc = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.id,
    });

    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      return null;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return null;
    }

    const newAccessToken = JWT.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    return { accessToken: newAccessToken };
  }

  public async invalidateUserTokens(userId: string): Promise<void> {
    await RefreshToken.deleteMany({ userId });
  }

  public async cleanupExpiredTokens(): Promise<void> {
    await RefreshToken.deleteMany({ expiresAt: { $lt: new Date() } });
  }

  public async revokeRefreshToken(token: string): Promise<void> {
    await RefreshToken.deleteOne({ token });
  }
}

export default AuthService;
