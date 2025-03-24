import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function withAuth(handler: Handler): Handler {
  return async (req, context) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "Not Authenticated!" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const userDetails = JSON.parse(atob(token.split(".")[1]));
    if (!userDetails) {
      return new Response(JSON.stringify({ error: "Not Authenticated!" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const decodedToken: void | { userId: string; iat: number; exp: number } = <
      { userId: string; iat: number; exp: number } | void
    >jwt.verify(
      token,
      `${userDetails.userId}${process.env.JWT_ENCRYPTION_SECRET_SALT}`,
      {
        algorithms: ["HS256"],
      }
    );
    if (!decodedToken?.userId) {
      return new Response(JSON.stringify({ error: "Not Authenticated!" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    req.userId = decodedToken.userId;
    return handler(req, context);
  };
}
