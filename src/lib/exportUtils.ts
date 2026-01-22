import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Transaction {
  id: number;
  total: number;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  };
  items: Array<{
    qty: number;
    product: {
      name: string;
    };
  }>;
}

interface ReportData {
  summary: {
    totalTransactions: number;
    totalRevenue: number;
  };
  topProducts: Array<{
    productId: number;
    name: string;
    qty: number;
    revenue: number;
  }>;
  transactions: Transaction[];
}

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format currency
const formatCurrency = (amount: number) => {
  return `Rp ${amount.toLocaleString("id-ID")}`;
};

// Export to PDF
export const exportToPDF = (
  data: ReportData,
  startDate?: string,
  endDate?: string,
) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Penjualan", 14, 20);

  // Period
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let periodText = "Semua Periode";
  if (startDate && endDate) {
    periodText = `Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`;
  }
  doc.text(periodText, 14, 28);

  // Summary
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Ringkasan", 14, 38);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Transaksi: ${data.summary.totalTransactions}`, 14, 45);
  doc.text(
    `Total Penjualan: ${formatCurrency(data.summary.totalRevenue)}`,
    14,
    52,
  );

  // Top Products
  if (data.topProducts.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Produk Terlaris", 14, 62);

    const topProductsData = data.topProducts.map((product, index) => [
      index + 1,
      product.name,
      product.qty,
      formatCurrency(product.revenue),
    ]);

    autoTable(doc, {
      startY: 66,
      head: [["No", "Produk", "Qty Terjual", "Total Revenue"]],
      body: topProductsData,
      theme: "grid",
      headStyles: { fillColor: [127, 29, 29] },
      styles: { fontSize: 9 },
    });
  }

  // Transactions
  const finalY = (doc as any).lastAutoTable?.finalY || 80;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Detail Transaksi", 14, finalY + 10);

  const transactionsData = data.transactions.map((transaction, index) => {
    const items = transaction.items
      .map((item) => `${item.product.name} (${item.qty})`)
      .join(", ");

    return [
      index + 1,
      formatDate(transaction.createdAt),
      transaction.user.fullName,
      items,
      formatCurrency(transaction.total),
    ];
  });

  autoTable(doc, {
    startY: finalY + 14,
    head: [["No", "Tanggal", "Kasir", "Item", "Total"]],
    body: transactionsData,
    theme: "grid",
    headStyles: { fillColor: [127, 29, 29] },
    styles: { fontSize: 8 },
    columnStyles: {
      3: { cellWidth: 60 }, // Item column wider
    },
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" },
    );
  }

  // Save
  const filename = `Laporan_Penjualan_${new Date().getTime()}.pdf`;
  doc.save(filename);
};

// Export to Excel
export const exportToExcel = (
  data: ReportData,
  startDate?: string,
  endDate?: string,
) => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = [
    ["Laporan Penjualan"],
    [],
    [
      "Periode",
      startDate && endDate ? `${startDate} - ${endDate}` : "Semua Periode",
    ],
    [],
    ["Ringkasan"],
    ["Total Transaksi", data.summary.totalTransactions],
    ["Total Penjualan", formatCurrency(data.summary.totalRevenue)],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Ringkasan");

  // Top Products Sheet
  if (data.topProducts.length > 0) {
    const topProductsData = [
      ["No", "Produk", "Qty Terjual", "Total Revenue"],
      ...data.topProducts.map((product, index) => [
        index + 1,
        product.name,
        product.qty,
        product.revenue,
      ]),
    ];

    const topProductsSheet = XLSX.utils.aoa_to_sheet(topProductsData);
    XLSX.utils.book_append_sheet(wb, topProductsSheet, "Produk Terlaris");
  }

  // Transactions Sheet
  const transactionsData = [
    ["No", "Tanggal", "Kasir", "Email", "Item", "Total"],
    ...data.transactions.map((transaction, index) => {
      const items = transaction.items
        .map((item) => `${item.product.name} (${item.qty})`)
        .join(", ");

      return [
        index + 1,
        formatDate(transaction.createdAt),
        transaction.user.fullName,
        transaction.user.email,
        items,
        transaction.total,
      ];
    }),
  ];

  const transactionsSheet = XLSX.utils.aoa_to_sheet(transactionsData);
  XLSX.utils.book_append_sheet(wb, transactionsSheet, "Detail Transaksi");

  // Save
  const filename = `Laporan_Penjualan_${new Date().getTime()}.xlsx`;
  XLSX.writeFile(wb, filename);
};
