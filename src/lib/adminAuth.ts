import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDB } from "./mongodb";
import { AdminTokenUser, generateAccessToken } from "./adminTokens";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret";

export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return null;
  }

  try {
    if (accessToken) {
      const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as AdminTokenUser;
      return decoded;
    }
  } catch (err) {
    // fall through to refresh-token based flow
  }

  if (!refreshToken) {
    return null;
  }

  try {
    const decodedRefresh = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { _id: string; email: string };

    const { db } = await connectToDB();
    const currentUser = await db.collection("admin").findOne({ email: decodedRefresh.email });

    if (!currentUser) {
      return null;
    }

    const userForToken: AdminTokenUser = {
      _id: currentUser._id.toString(),
      email: currentUser.email,
      isAdmin: currentUser.isAdmin,
      name: currentUser.name,
      phone: currentUser.phone,
    };
    return userForToken;
  } catch (err) {
    return null;
  }
}
