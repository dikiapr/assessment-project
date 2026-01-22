"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; price: number; stock: number }) => void;
  product?: { id: number; name: string; price: number; stock: number } | null;
  title: string;
}

const ProductModal = ({ isOpen, onClose, onSave, product, title }: Props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);

  // Set initial values when editing
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
    } else {
      setName("");
      setPrice("");
      setStock("");
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        name,
        price: parseInt(price),
        stock: parseInt(stock),
      });

      // Reset form
      setName("");
      setPrice("");
      setStock("");
    } catch (error) {
      console.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Produk
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-900 focus:outline-none"
              placeholder="Masukkan nama produk"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Harga</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-900 focus:outline-none"
              placeholder="Masukkan harga"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stok</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-900 focus:outline-none"
              placeholder="Masukkan stok"
              required
              min="0"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-900 hover:bg-red-800 text-white py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
