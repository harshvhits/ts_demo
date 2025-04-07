import { ITokenPayload } from "../../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: import("../utils/jwt").ITokenPayload;
    }
  }
}
