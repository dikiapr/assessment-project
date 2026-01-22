import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse, errorResponse } from "@/src/lib/response";
import { requireAdmin } from "@/src/lib/auth";

// GET - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return errorResponse("Produk tidak ditemukan", 404);
    }

    return successResponse(product, "Data produk berhasil diambil");
  } catch (error) {
    console.error("Get product error:", error);
    return errorResponse("Terjadi kesalahan server", 500);
  }
}

// PUT - Update product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = requireAdmin(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    const { id } = await params;
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

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return errorResponse("Produk tidak ditemukan", 404);
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseInt(price),
        stock: parseInt(stock),
      },
    });

    return successResponse(product, "Produk berhasil diupdate");
  } catch (error) {
    console.error("Update product error:", error);
    return errorResponse("Terjadi kesalahan server", 500);
  }
}

// DELETE - Delete product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = requireAdmin(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    const { id } = await params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return errorResponse("Produk tidak ditemukan", 404);
    }

    // Delete product
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return successResponse(null, "Produk berhasil dihapus");
  } catch (error) {
    console.error("Delete product error:", error);
    return errorResponse("Terjadi kesalahan server", 500);
  }
}
