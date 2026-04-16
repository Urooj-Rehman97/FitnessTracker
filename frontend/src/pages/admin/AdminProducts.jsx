import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Plus, Edit, Trash2, RefreshCw, X, Package } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      // ✅ Sahi endpoint aur query parameters
      const { data } = await axiosInstance.get(
        `/api/admin/products?page=${pageNumber}&limit=5`
      );

      // Backend se "products" ka array aur "pagination" object handle karna
      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setPage(data.pagination?.currentPage || pageNumber);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ================= SUBMIT (ADD / UPDATE) =================
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!editingId && !image) {
    toast.error("Product image is required");
    return;
  }

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("description", form.description);
  formData.append("price", Number(form.price)); // ✅ FIX
  formData.append("category", form.category);
  if (image) formData.append("image", image);

  try {
    if (editingId) {
      await axiosInstance.put(`/api/admin/products/${editingId}`, formData);
      toast.success("Product updated successfully!");
    } else {
      await axiosInstance.post("/api/admin/products", formData);
      toast.success("Product added successfully!");
    }

    resetForm();
    fetchProducts(page);
  } catch (err) {
    console.error("Submit Error:", err.response?.data || err);
    toast.error(err.response?.data?.message || "Product save failed");
  }
};


  // ================= EDIT =================
  const handleEdit = (prod) => {
    setEditingId(prod._id);
    setForm({
      name: prod.name,
      description: prod.description || "",
      price: prod.price,
      category: prod.category || "",
    });
    setPreview(prod.image || null);
    setModalOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This product will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#facc15",
    cancelButtonColor: "#ef4444",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await axiosInstance.delete(`/api/admin/products/${id}`);

    Swal.fire({
      title: "Deleted!",
      text: "Product has been deleted successfully.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    // ✅ pagination logic (original preserved)
    if (products.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      fetchProducts(page);
    }
  } catch (err) {
    Swal.fire("Error", "Failed to delete product", "error");
  }
};


  const resetForm = () => {
    setModalOpen(false);
    setEditingId(null);
    setImage(null);
    setPreview(null);
    setForm({ name: "", description: "", price: "", category: "" });
  };

  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin w-12 h-12 text-brand-primary" />
        <p className="text-text-muted mt-4 font-medium">Syncing Products...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 mx-auto space-y-8 animate-in fade-in duration-500">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-text-base flex items-center gap-3">
              <Package className="w-10 h-10 text-brand-primary" />
              Inventory Control
            </h1>
            <p className="text-text-muted mt-2">Add, Edit or Remove products from the store</p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all"
          >
            <Plus size={20} /> New Product
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-surface-card border border-border-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-card-alt/50 border-b border-border-card">
                <tr>
                  <th className="p-5 text-text-muted font-medium uppercase text-xs tracking-wider">#</th>
                  <th className="p-5 text-text-muted font-medium uppercase text-xs tracking-wider">Product</th>
                  <th className="p-5 text-text-muted font-medium uppercase text-xs tracking-wider">Price</th>
                  <th className="p-5 text-text-muted font-medium uppercase text-xs tracking-wider">Category</th>
                  <th className="p-5 text-text-muted font-medium uppercase text-xs tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-card">
                {products.length > 0 ? (
                  products.map((prod, i) => (
                    <tr key={prod._id} className="hover:bg-surface-hover transition-colors group">
                      <td className="p-5 text-text-muted text-sm">{(page - 1) * 5 + i + 1}</td>
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-surface-card-alt border border-border-card overflow-hidden flex-shrink-0">
                            {prod.image ? (
                              <img src={prod.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-text-muted">No Img</div>
                            )}
                          </div>
                          <span className="font-semibold text-text-base">{prod.name}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="px-3 py-1 rounded-lg text-sm font-bold bg-success/10 text-success border border-success/20">
                          PKR {prod.price}
                        </span>
                      </td>
                      <td className="p-5 text-text-muted text-sm capitalize">{prod.category || "Uncategorized"}</td>
                      <td className="p-5">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(prod)} className="p-2 hover:bg-brand-primary/10 rounded-lg group/edit">
                            <Edit size={18} className="text-text-muted group-hover/edit:text-brand-primary transition-colors" />
                          </button>
                          <button onClick={() => handleDelete(prod._id)} className="p-2 hover:bg-error/10 rounded-lg group/del">
                            <Trash2 size={18} className="text-text-muted group-hover/del:text-error transition-colors" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-text-muted italic">No products found in inventory.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 bg-surface-card-alt/30 border-t border-border-card">
              <p className="text-sm text-text-muted">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 rounded-lg border border-border-card bg-surface-card hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 rounded-lg border border-border-card bg-surface-card hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-surface-card border border-border-card rounded-3xl max-w-2xl w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
            <div className="p-6 border-b border-border-card flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-base">
                {editingId ? "Update Product Details" : "Create New Product"}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-surface-card-alt rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Product Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-surface-card-alt border border-border-card rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Price (PKR)</label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-surface-card-alt border border-border-card rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-text-muted">Description (Optional)</label>
                  <textarea
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-surface-card-alt border border-border-card rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Category</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-surface-card-alt border border-border-card rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>

                {/* IMAGE UPLOAD SECTION */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Product Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-border-card flex items-center justify-center overflow-hidden bg-surface-card-alt">
                      {preview ? (
                        <img src={preview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Plus className="text-text-muted" size={20} />
                      )}
                    </div>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setImage(file);
                          setPreview(URL.createObjectURL(file));
                        }}
                      />
                      <div className="text-center px-4 py-2 border border-border-card rounded-xl hover:border-brand-primary text-sm transition-all bg-surface-card-alt/50">
                        Upload Image
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border border-border-card rounded-xl font-bold hover:bg-surface-card-alt transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 px-10 py-3 bg-brand-primary text-black rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  {editingId ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
