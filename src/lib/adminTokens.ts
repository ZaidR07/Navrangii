import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret";

export interface AdminTokenUser {
  _id: string;
  email: string;
  isAdmin: boolean;
  name?: string;
  phone?: string;
}

export function generateAccessToken(user: AdminTokenUser) {
  const payload = {
    _id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
}

export function generateRefreshToken(user: AdminTokenUser) {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}
