"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { productsAPI, transactionsAPI } from "@/src/services/api";
import ConfirmationDialog from "@/src/components/dialog/ConfirmationDialog";
import SuccessDialog from "@/src/components/dialog/SuccessDialog";
import ErrorDialog from "@/src/components/dialog/ErrorDialog";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  qty: number;
}

const TransactionsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll();
        setProducts(response.data);
      } catch (error: any) {
        setErrorMessage(error.message || "Gagal mengambil data produk");
        setShowErrorDialog(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      // Check stock
      if (existing.qty >= product.stock) {
        setErrorMessage(`Stok ${product.name} tidak mencukupi`);
        setShowErrorDialog(true);
        return;
      }

      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
    } else {
      if (product.stock === 0) {
        setErrorMessage(`Stok ${product.name} habis`);
        setShowErrorDialog(true);
        return;
      }
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQty = (id: number, qty: number) => {
    const product = products.find((p) => p.id === id);

    if (!product) return;

    if (qty > product.stock) {
      setErrorMessage(
        `Stok ${product.name} tidak mencukupi. Maksimal: ${product.stock}`,
      );
      setShowErrorDialog(true);
      return;
    }

    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(cart.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSaveTransaction = () => {
    if (cart.length === 0) {
      setErrorMessage("Keranjang masih kosong");
      setShowErrorDialog(true);
      return;
    }

    setShowSaveConfirm(true);
  };

  const confirmSaveTransaction = async () => {
    setShowSaveConfirm(false);
    setSaving(true);

    try {
      const items = cart.map((item) => ({
        productId: item.id,
        qty: item.qty,
      }));

      await transactionsAPI.create(items);
      setShowSuccessDialog(true);

      // Clear cart and refresh products
      setCart([]);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error: any) {
      setErrorMessage(error.message || "Gagal menyimpan transaksi");
      setShowErrorDialog(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Transaksi Penjualan
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Product List */}
        <div className="col-span-2 bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Daftar Produk</h2>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2 text-sm">Produk</th>
                  <th className="text-left px-4 py-2 text-sm">Harga</th>
                  <th className="text-left px-4 py-2 text-sm">Stok</th>
                  <th className="text-center px-4 py-2 text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      Tidak ada produk tersedia
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="px-4 py-3 text-sm">{product.name}</td>
                      <td className="px-4 py-3 text-sm">
                        Rp {product.price.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {product.stock === 0 ? (
                          <span className="text-red-600 font-medium">
                            Habis
                          </span>
                        ) : (
                          product.stock
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="inline-flex items-center gap-1 bg-red-900 hover:bg-red-800 text-white px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={14} />
                          Tambah
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Cart */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Keranjang</h2>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              Belum ada produk
            </p>
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto max-h-96">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>

                    {/* Qty Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateQty(item.id, parseInt(e.target.value) || 0)
                        }
                        className="w-12 text-center border rounded px-1 py-0.5 text-sm"
                        min="1"
                      />
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold mb-2">
                      Rp {(item.price * item.qty).toLocaleString("id-ID")}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          <div className="border-t-2 pt-4 mt-4">
            <div className="flex justify-between text-base font-bold mb-4">
              <span>Total</span>
              <span className="text-red-900">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>

            <button
              onClick={handleSaveTransaction}
              disabled={cart.length === 0 || saving}
              className="w-full bg-red-900 hover:bg-red-800 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Menyimpan..." : "Simpan Transaksi"}
            </button>
          </div>
        </div>
      </div>

      {/* Save Transaction Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showSaveConfirm}
        onCancel={() => setShowSaveConfirm(false)}
        onConfirm={confirmSaveTransaction}
        title="Konfirmasi Transaksi"
        description={`Total transaksi: Rp ${total.toLocaleString("id-ID")}. Apakah Anda yakin ingin menyimpan transaksi ini?`}
        confirmText="Ya, Simpan"
        cancelText="Batal"
        isLoading={saving}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Transaksi Berhasil!"
        message="Transaksi telah berhasil disimpan dan stok produk telah diperbarui."
      />

      {/* Error Dialog */}
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        title="Terjadi Kesalahan"
        message={errorMessage}
      />
    </div>
  );
};

export default TransactionsPage;
