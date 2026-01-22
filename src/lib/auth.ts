import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";
import { errorResponse } from "./response";

export function getAuthUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return null;
    }

    return decoded as { id: number; email: string; role: string };
  } catch (error) {
    return null;
  }
}

export function requireAuth(request: NextRequest) {
  const user = getAuthUser(request);

  if (!user) {
    return { error: errorResponse("Unauthorized - Token tidak valid", 401) };
  }

  return { user };
}

export function requireAdmin(request: NextRequest) {
  const authResult = requireAuth(request);

  if ("error" in authResult) {
    return authResult;
  }

  if (authResult.user.role !== "ADMIN") {
    return {
      error: errorResponse("Forbidden - Hanya admin yang dapat mengakses", 403),
    };
  }

  return authResult;
}
