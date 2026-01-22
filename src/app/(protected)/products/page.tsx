"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ProductModal from "@/src/components/modal/ProductModal";
import { productsAPI } from "@/src/services/api";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const ProductsPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error: any) {
      alert(error.message || "Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle add product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setOpenModal(true);
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  // Handle delete product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      await productsAPI.delete(id);
      alert("Produk berhasil dihapus");
      fetchProducts(); // Refresh data
    } catch (error: any) {
      alert(error.message || "Gagal menghapus produk");
    }
  };

  // Handle save product (create or update)
  const handleSaveProduct = async (data: {
    name: string;
    price: number;
    stock: number;
  }) => {
    try {
      if (selectedProduct) {
        // Update
        await productsAPI.update(selectedProduct.id, data);
        alert("Produk berhasil diupdate");
      } else {
        // Create
        await productsAPI.create(data);
        alert("Produk berhasil ditambahkan");
      }
      setOpenModal(false);
      fetchProducts(); // Refresh data
    } catch (error: any) {
      alert(error.message || "Gagal menyimpan produk");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Master Data Produk
        </h1>

        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Tambah Produk
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">
                No
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">
                Nama Produk
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">
                Harga
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">
                Stok
              </th>
              <th className="text-center px-6 py-3 text-sm font-medium text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Data produk belum tersedia
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    Rp {product.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ProductModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        title={selectedProduct ? "Edit Produk" : "Tambah Produk"}
      />
    </div>
  );
};

export default ProductsPage;
