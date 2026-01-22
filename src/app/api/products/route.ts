import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse, errorResponse } from "@/src/lib/response";
import { requireAuth, requireAdmin } from "@/src/lib/auth";

// GET - List all products
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
    });

    return successResponse(products, "Data produk berhasil diambil");
  } catch (error) {
    console.error("Get products error:", error);
    return errorResponse("Terjadi kesalahan server", 500);
  }
}

// POST - Create new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAdmin(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    const body = await request.json();
    const { name, price, stock } = body;

    // Validasi input
    if (!name || price === undefined || stock === undefined) {
      return errorResponse("Nama, harga, dan stok produk harus diisi");
    }

    if (price < 0) {
      return errorResponse("Harga tidak boleh negatif");
    }

    if (stock < 0) {
      return errorResponse("Stok tidak boleh negatif");
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        price: parseInt(price),
        stock: parseInt(stock),
      },
    });

    return successResponse(product, "Produk berhasil ditambahkan", 201);
  } catch (error) {
    console.error("Create product error:", error);
    return errorResponse("Terjadi kesalahan server", 500);
  }
}
