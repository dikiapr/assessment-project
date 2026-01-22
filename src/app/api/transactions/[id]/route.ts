import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse, errorResponse } from "@/src/lib/response";
import { requireAuth } from "@/src/lib/auth";

// GET - Get transaction detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = requireAuth(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    const { id } = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!transaction) {
      return errorResponse("Transaksi tidak ditemukan", 404);
    }

    return successResponse(transaction, "Detail transaksi berhasil diambil");
  } catch (error) {
    console.error("Get transaction error:", error);
    return errorResponse("Terjadi kesalahan server", 500);
  }
}
