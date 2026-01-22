"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ProductModal from "@/src/components/modal/ProductModal";
import { productsAPI } from "@/src/services/api";
import ConfirmationDialog from "@/src/components/dialog/ConfirmationDialog";
import SuccessDialog from "@/src/components/dialog/SuccessDialog";
import ErrorDialog from "@/src/components/dialog/ErrorDialog";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products
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
  const handleDeleteProduct = (id: number) => {
    setProductToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Confirm delete product
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      await productsAPI.delete(productToDelete);
      setShowDeleteConfirm(false);
      setSuccessMessage("Produk berhasil dihapus");
      setShowSuccessDialog(true);
      fetchProducts(); // Refresh data
    } catch (error: any) {
      setShowDeleteConfirm(false);
      setErrorMessage(error.message || "Gagal menghapus produk");
      setShowErrorDialog(true);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
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
        setSuccessMessage("Produk berhasil diupdate");
      } else {
        // Create
        await productsAPI.create(data);
        setSuccessMessage("Produk berhasil ditambahkan");
      }
      setOpenModal(false);
      setShowSuccessDialog(true);
      fetchProducts(); // Refresh data
    } catch (error: any) {
      setErrorMessage(error.message || "Gagal menyimpan produk");
      setShowErrorDialog(true);
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

      {/* Product Modal */}
      <ProductModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        title={selectedProduct ? "Edit Produk" : "Tambah Produk"}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDeleteProduct}
        title="Hapus Produk"
        description="Apakah Anda yakin ingin menghapus produk ini? Data yang dihapus tidak dapat dikembalikan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={isDeleting}
      />

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

export default ProductsPage;
