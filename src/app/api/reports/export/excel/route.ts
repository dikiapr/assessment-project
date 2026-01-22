import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { errorResponse } from "@/src/lib/response";
import { requireAuth } from "@/src/lib/auth";
import { generateExcel } from "@/src/services/reportExport.service";

export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const whereClause: any = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      whereClause.createdAt = {
        gte: start,
        lte: end,
      };
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
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

    // Calculate summary
    const totalTransactions = transactions.length;
    const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);

    // Top selling products
    const productSales: {
      [key: number]: { name: string; qty: number; revenue: number };
    } = {};

    transactions.forEach((t) => {
      t.items.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.product.name,
            qty: 0,
            revenue: 0,
          };
        }
        productSales[item.productId].qty += item.qty;
        productSales[item.productId].revenue += item.subtotal;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({
        productId: parseInt(id),
        ...data,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const reportData = {
      summary: {
        totalTransactions,
        totalRevenue,
      },
      topProducts,
      transactions,
    };

    // Generate Excel
    const excelBuffer = generateExcel(
      reportData,
      startDate || undefined,
      endDate || undefined,
    );

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(excelBuffer);

    // Return Excel
    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=Laporan_Penjualan_${new Date().getTime()}.xlsx`,
      },
    });
  } catch (error) {
    console.error("Export Excel error:", error);
    return errorResponse("Terjadi kesalahan server", 500);
  }
}
