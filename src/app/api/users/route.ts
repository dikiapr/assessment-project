import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse, errorResponse } from "@/src/lib/response";
import { requireAdmin } from "@/src/lib/auth";

// GET - List all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAdmin(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { id: "asc" },
    });

    return successResponse(users, "Data user berhasil diambil");
  } catch (error) {
    console.error("Get users error:", error);
    return errorResponse("Terjadi kesalahan server", 500);
  }
}
