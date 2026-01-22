import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse, errorResponse } from "@/src/lib/response";
import { requireAuth } from "@/src/lib/auth";

// GET - List all transactions
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    const transactions = await prisma.transaction.findMany({
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
      orderBy: { createdAt: "desc" },
    });

    return successResponse(transactions, "Data transaksi berhasil diambil");
  } catch (error) {
    console.error("Get transactions error:", error);
    return errorResponse("Terjadi kesalahan server", 500);
  }
}

// POST - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    const body = await request.json();
    const { items } = body; // items = [{ productId, qty }]

    // Validasi input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse("Items transaksi harus diisi");
    }

    // Validasi setiap item
    for (const item of items) {
      if (!item.productId || !item.qty || item.qty <= 0) {
        return errorResponse("ProductId dan qty harus valid");
      }
    }

    // Ambil data produk dan cek stok
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    if (products.length !== productIds.length) {
      return errorResponse("Beberapa produk tidak ditemukan");
    }

    // Cek stok dan hitung total
    let total = 0;
    const transactionItems: any = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        return errorResponse(
          `Produk dengan ID ${item.productId} tidak ditemukan`,
        );
      }

      if (product.stock < item.qty) {
        return errorResponse(
          `Stok ${product.name} tidak mencukupi. Stok tersedia: ${product.stock}`,
        );
      }

      const subtotal = product.price * item.qty;
      total += subtotal;

      transactionItems.push({
        productId: product.id,
        qty: item.qty,
        price: product.price,
        subtotal: subtotal,
      });
    }

    // Buat transaksi dengan items dalam satu transaction database
    const transaction = await prisma.$transaction(async (tx) => {
      // Create transaction
      const newTransaction = await tx.transaction.create({
        data: {
          userId: authResult.user.id,
          total: total,
          items: {
            create: transactionItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
        },
      });

      // Update stock untuk setiap produk
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.qty,
            },
          },
        });
      }

      return newTransaction;
    });

    return successResponse(transaction, "Transaksi berhasil disimpan", 201);
  } catch (error) {
    console.error("Create transaction error:", error);
    return errorResponse("Terjadi kesalahan server", 500);
  }
}
