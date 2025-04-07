
import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/my-node-ts-app",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "your_access_jwt_secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "your_refresh_jwt_secret",
  fromEmail: process.env.FROM_EMAIL || "example@example.com",
  sendGridAPIKey: process.env.SENDGRID_API_KEY || "akjdbajkhdjhafjleh",
  frontendURL: process.env.FRONTEND_URL || "http://localhost:3000",
};
