"use client";

import { useState, useEffect } from "react";
import { reportsAPI } from "@/src/services/api";
import { FileSpreadsheet, FileText } from "lucide-react";
import SuccessDialog from "@/src/components/dialog/SuccessDialog";
import ErrorDialog from "@/src/components/dialog/ErrorDialog";

interface Transaction {
  id: number;
  total: number;
  createdAt: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
  items: Array<{
    id: number;
    qty: number;
    price: number;
    subtotal: number;
    product: {
      id: number;
      name: string;
      price: number;
    };
  }>;
}

interface ReportData {
  summary: {
    totalTransactions: number;
    totalRevenue: number;
  };
  revenueByDate: { [key: string]: number };
  topProducts: Array<{
    productId: number;
    name: string;
    qty: number;
    revenue: number;
  }>;
  transactions: Transaction[];
}

const ReportsPage = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [exporting, setExporting] = useState(false);

  const fetchReports = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      const response = await reportsAPI.get(start, end);
      setReportData(response.data);
    } catch (error: any) {
      setErrorMessage(error.message || "Gagal mengambil data laporan");
      setShowErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilter = () => {
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        setErrorMessage(
          "Tanggal mulai tidak boleh lebih besar dari tanggal akhir",
        );
        setShowErrorDialog(true);
        return;
      }
      fetchReports(startDate, endDate);
    } else if (startDate || endDate) {
      setErrorMessage("Harap isi kedua tanggal untuk filter");
      setShowErrorDialog(true);
    } else {
      fetchReports();
    }
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    fetchReports();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExportPDF = async () => {
    if (!reportData) {
      setErrorMessage("Tidak ada data untuk di-export");
      setShowErrorDialog(true);
      return;
    }
    try {
      setExporting(true);
      await reportsAPI.exportPDF(startDate, endDate);
      setSuccessMessage("Laporan PDF berhasil di-export!");
      setShowSuccessDialog(true);
    } catch (error: any) {
      setErrorMessage(error.message || "Gagal export PDF");
      setShowErrorDialog(true);
    } finally {
      setExporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (!reportData) {
      setErrorMessage("Tidak ada data untuk di-export");
      setShowErrorDialog(true);
      return;
    }
    try {
      setExporting(true);
      await reportsAPI.exportExcel(startDate, endDate);
      setSuccessMessage("Laporan Excel berhasil di-export!");
      setShowSuccessDialog(true);
    } catch (error: any) {
      setErrorMessage(error.message || "Gagal export Excel");
      setShowErrorDialog(true);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12 text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-6">
        <div className="text-center py-12 text-gray-500">
          Tidak ada data laporan
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Laporan Penjualan
        </h1>

        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            disabled={loading || !reportData || exporting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={18} />
            {exporting ? "Exporting..." : "Export PDF"}
          </button>

          <button
            onClick={handleExportExcel}
            disabled={loading || !reportData || exporting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={18} />
            {exporting ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Tanggal Mulai
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Tanggal Akhir
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-900 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleFilter}
            className="bg-red-900 hover:bg-red-800 text-white px-6 py-2 rounded-lg font-medium"
          >
            Filter
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Total Transaksi</p>
          <p className="text-3xl font-bold text-gray-800">
            {reportData.summary.totalTransactions}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Total Penjualan</p>
          <p className="text-3xl font-bold text-red-900">
            Rp {reportData.summary.totalRevenue.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Top Products */}
      {reportData.topProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Produk Terlaris</h2>
          <div className="space-y-3">
            {reportData.topProducts.map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center justify-between border-b pb-3 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Terjual: {product.qty} unit
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    Rp {product.revenue.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Detail Transaksi</h2>
        </div>

        {reportData.transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Tidak ada transaksi
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium">
                    No
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium">
                    Tanggal
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium">
                    Kasir
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium">
                    Item
                  </th>
                  <th className="text-right px-6 py-3 text-sm font-medium">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                    <td className="px-6 py-4 text-sm">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium">
                          {transaction.user.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="space-y-1">
                        {transaction.items.map((item) => (
                          <div key={item.id} className="text-xs">
                            {item.product.name} x {item.qty}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold">
                      Rp {transaction.total.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Berhasil!"
        message={successMessage}
      />

      {/* Error Dialog */}
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        title="Gagal!"
        message={errorMessage}
      />
    </div>
  );
};

export default ReportsPage;
