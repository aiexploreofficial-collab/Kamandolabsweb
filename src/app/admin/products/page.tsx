"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import {
  Dumbbell,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  AlertTriangle,
  FolderPlus,
  Layout,
  Tag,
  Star,
  Layers,
  Sparkles,
  Info,
  XCircle,
  Eye,
  CheckCircle2,
  Upload,
  X,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const uploadFileXHR = (file: File, onProgress: (percent: number) => void): Promise<any> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/cloudinary");
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve(res);
        } catch (e) {
          reject(new Error("Invalid response from server"));
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          reject(new Error(res.error || "Upload failed"));
        } catch (e) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };
    
    xhr.onerror = () => {
      reject(new Error("Network error during upload"));
    };
    
    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  });
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL"); // "ALL" | "ACTIVE" | "DRAFT" | "ARCHIVED"

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Category form state
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  // Product form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [isFeatured, setIsFeatured] = useState(false);
  const [themeColor, setThemeColor] = useState("spartan-red");
  const [gallery, setGallery] = useState<any[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<any[]>([]);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  
  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // Variants builder state
  const [variants, setVariants] = useState<any[]>([
    { flavor: "", size: "", mrp: "", salePrice: "", stock: "" }
  ]);

  const [submittingProduct, setSubmittingProduct] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const json = await res.json();
        setProducts(json.products || []);
        setCategories(json.categories || []);
        if (json.categories?.length > 0 && !categoryId) {
          setCategoryId(json.categories[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setShortDescription("");
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    } else {
      setCategoryId("");
    }
    setStatus("DRAFT");
    setIsFeatured(false);
    setThemeColor("spartan-red");
    setGallery([]);
    setUploadingFiles([]);
    setReplaceIndex(null);
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setVariants([{ flavor: "Spartan Chocolate", size: "1kg", mrp: "4999", salePrice: "3899", stock: "50" }]);
    setShowProductModal(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setName(prod.name || "");
    setDescription(prod.description || "");
    setShortDescription(prod.shortDescription || "");
    setCategoryId(prod.categoryId || "");
    setStatus(prod.status || "DRAFT");
    setIsFeatured(prod.isFeatured || false);
    setThemeColor(prod.themeColor || "spartan-red");
    setGallery(prod.gallery || []);
    setUploadingFiles([]);
    setReplaceIndex(null);
    setSeoTitle(prod.seoTitle || "");
    setSeoDescription(prod.seoDescription || "");
    setSeoKeywords(prod.seoKeywords || "");
    
    // Set variants
    if (prod.variants && prod.variants.length > 0) {
      setVariants(prod.variants.map((v: any) => ({
        id: v.id,
        name: v.name,
        flavor: v.flavor || "",
        size: v.size || "",
        mrp: v.mrp.toString(),
        salePrice: v.salePrice.toString(),
        stock: v.stock.toString()
      })));
    } else {
      setVariants([{ flavor: "", size: "", mrp: "", salePrice: "", stock: "" }]);
    }
    setShowProductModal(true);
  };

  const handleAddVariantRow = () => {
    setVariants([...variants, { flavor: "", size: "", mrp: "", salePrice: "", stock: "" }]);
  };

  const handleRemoveVariantRow = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFilesUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFilesUpload(Array.from(e.target.files));
    }
  };

  const handleFilesUpload = async (files: File[]) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const imagesToUpload = files.filter((file) => validTypes.includes(file.type));
    
    if (imagesToUpload.length === 0) {
      alert("Invalid file type. Only JPEG, PNG, and WEBP images are supported.");
      return;
    }

    for (const file of imagesToUpload) {
      const uploadId = Math.random().toString(36).substring(7);
      setUploadingFiles((prev) => [...prev, { id: uploadId, name: file.name, progress: 0 }]);

      try {
        const result = await uploadFileXHR(file, (percent) => {
          setUploadingFiles((prev) => 
            prev.map((f) => (f.id === uploadId ? { ...f, progress: percent } : f))
          );
        });

        // Add uploaded image to gallery: { url, public_id, alt }
        setGallery((prev) => [
          ...prev,
          {
            url: result.url,
            public_id: result.public_id,
            alt: result.alt || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
          }
        ]);

        // Remove from uploading list
        setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadId));
      } catch (err: any) {
        console.error("Upload error:", err);
        setUploadingFiles((prev) => 
          prev.map((f) => (f.id === uploadId ? { ...f, error: err.message || "Failed" } : f))
        );
      }
    }
  };

  const handleRemoveGalleryItem = async (index: number) => {
    const item = gallery[index];
    if (item && typeof item === "object" && item.public_id) {
      const confirmDelete = confirm("Are you sure you want to delete this image from Cloudinary?");
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/api/admin/cloudinary?public_id=${encodeURIComponent(item.public_id)}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          console.error("Failed to delete from Cloudinary server");
        }
      } catch (err) {
        console.error("Error calling Cloudinary delete API:", err);
      }
    }
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReplaceClick = (index: number) => {
    setReplaceIndex(index);
    const replaceInput = document.getElementById("replace-file-input") as HTMLInputElement;
    if (replaceInput) {
      replaceInput.click();
    }
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replaceIndex === null || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const indexToReplace = replaceIndex;
    setReplaceIndex(null);

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Only JPEG, PNG, and WEBP images are supported.");
      return;
    }

    const uploadId = Math.random().toString(36).substring(7);
    setUploadingFiles((prev) => [...prev, { id: uploadId, name: `Replacing: ${file.name}`, progress: 0 }]);

    try {
      const result = await uploadFileXHR(file, (percent) => {
        setUploadingFiles((prev) => 
          prev.map((f) => (f.id === uploadId ? { ...f, progress: percent } : f))
        );
      });

      // Delete the old image if it's a Cloudinary object
      const oldItem = gallery[indexToReplace];
      if (oldItem && typeof oldItem === "object" && oldItem.public_id) {
        try {
          await fetch(`/api/admin/cloudinary?public_id=${encodeURIComponent(oldItem.public_id)}`, {
            method: "DELETE",
          });
        } catch (err) {
          console.error("Error deleting replaced image:", err);
        }
      }

      // Replace in gallery
      setGallery((prev) =>
        prev.map((item, i) =>
          i === indexToReplace
            ? {
                url: result.url,
                public_id: result.public_id,
                alt: result.alt || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
              }
            : item
        )
      );

      // Remove from uploading list
      setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadId));
    } catch (err: any) {
      console.error("Replace upload error:", err);
      setUploadingFiles((prev) => 
        prev.map((f) => (f.id === uploadId ? { ...f, error: err.message || "Failed" } : f))
      );
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      alert("Please select or create a category first.");
      return;
    }

    setSubmittingProduct(true);
    const payload = {
      name,
      description,
      shortDescription,
      categoryId,
      status,
      isFeatured,
      themeColor,
      gallery,
      seoTitle,
      seoDescription,
      seoKeywords,
      variants: variants.map((v) => ({
        id: v.id || undefined,
        name: v.name || `${v.flavor} - ${v.size}`,
        flavor: v.flavor || null,
        size: v.size || null,
        mrp: Number(v.mrp),
        salePrice: Number(v.salePrice),
        stock: Number(v.stock),
      })),
    };

    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
      const method = editingProduct ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowProductModal(false);
        loadData();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to save product");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this product? All reviews and variants will be deleted.")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        loadData();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    setSavingCategory(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName, description: newCatDesc }),
      });

      if (res.ok) {
        const json = await res.json();
        setNewCatName("");
        setNewCatDesc("");
        setShowCategoryModal(false);
        // Refresh categories lists
        const freshCatRes = await fetch("/api/admin/categories");
        if (freshCatRes.ok) {
          const freshCats = await freshCatRes.json();
          setCategories(freshCats);
          // Set selection to the new category
          if (json.category?.id) {
            setCategoryId(json.category.id);
          }
        }
      } else {
        const json = await res.json();
        alert(json.error || "Failed to create category");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating category");
    } finally {
      setSavingCategory(false);
    }
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(search.toLowerCase()) || 
                          prod.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === "ALL" ? true : prod.status === filter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="font-display font-black text-2xl tracking-tight uppercase italic">Supplement Catalogue</h1>
          <p className="text-xs text-neutral-500 mt-1">Manage active listings, configure dynamic pricing, and monitor stocks.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 focus:border-red-600 rounded-none pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none w-56 tracking-wide"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="bg-red-600 hover:bg-red-705 text-white font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-none transition-all flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex bg-neutral-950 p-1 border border-neutral-800 rounded-none w-fit text-[10px] font-bold uppercase tracking-wider">
        {["ALL", "ACTIVE", "DRAFT", "ARCHIVED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2.5 rounded-none transition-all ${
              filter === tab ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500 text-xs">Syncing inventory database...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-neutral-950/40 border border-neutral-800 rounded-none">
          <Dumbbell className="w-8 h-8 text-neutral-600 mx-auto mb-3 animate-pulse" />
          <p className="text-neutral-500 text-xs font-semibold">No supplements in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => {
            const activeVariants = (prod.variants || []).filter((v: any) => v.isActive);
            const totalStock = activeVariants.reduce((sum: number, v: any) => sum + v.stock, 0);
            const lowestPrice = activeVariants.length > 0 
              ? Math.min(...activeVariants.map((v: any) => Number(v.salePrice)))
              : 0;

            return (
              <motion.div
                key={prod.id}
                whileHover={{ y: -3 }}
                className="bg-neutral-950 border border-neutral-800 hover:border-red-600 p-5 rounded-none flex flex-col justify-between gap-5 relative overflow-hidden transition-all"
              >
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between mb-3 text-[9px] font-black uppercase tracking-wider">
                    <span className="text-neutral-500 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-red-500" />
                      {prod.category?.name || "Uncategorized"}
                    </span>
                    <span className={`px-2 py-0.5 rounded-none ${
                      prod.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : prod.status === "DRAFT"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : "bg-red-650/10 text-red-500 border border-red-900/20"
                    }`}>
                      {prod.status}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-sm text-white line-clamp-1 uppercase italic">{prod.name}</h3>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {prod.shortDescription || "No short description provided."}
                  </p>

                  {/* Stock and Price details */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-800">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Total Stock</p>
                      <p className={`text-xs font-mono font-black mt-0.5 ${totalStock === 0 ? "text-red-500" : "text-white"}`}>
                        {totalStock} Units
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Starting Price</p>
                      <p className="text-xs font-mono font-black text-white mt-0.5">
                        {formatPrice(lowestPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Variants Pills */}
                  {activeVariants.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {activeVariants.map((v: any) => (
                        <span key={v.id} className="text-[9px] font-mono text-neutral-450 bg-[#161616] border border-neutral-800 px-2 py-0.5 rounded-none">
                          {v.size || v.flavor} ({v.stock})
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card footer actions */}
                <div className="flex gap-2 border-t border-neutral-800 pt-4 mt-2">
                  <button
                    onClick={() => openEditModal(prod)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-none text-[10px] font-bold transition-all uppercase tracking-wider"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="flex-shrink-0 p-2 bg-neutral-900 hover:bg-red-950/20 border border-neutral-800 hover:border-red-900/30 text-neutral-500 hover:text-red-500 rounded-none transition-all"
                    title="Hard Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProductModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-neutral-950 border border-neutral-800 rounded-none p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10 flex flex-col gap-6"
            >
              <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="font-display font-black text-base uppercase text-white italic">
                    {editingProduct ? "Modify Supplement Listing" : "Add Supplement to Catalog"}
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Define sizes, flavors, target pricing, stock parameters, and search tags.
                  </p>
                </div>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="p-1 text-neutral-500 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="flex flex-col gap-6">
                {/* Form Section: Base details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Supplement Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Komando Creatine Monohydrate"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Category</label>
                          <button
                            type="button"
                            onClick={() => setShowCategoryModal(true)}
                            className="text-[9px] font-bold text-red-500 hover:text-red-400 flex items-center gap-1"
                          >
                            <FolderPlus className="w-3 h-3" /> New
                          </button>
                        </div>
                        <select
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                          required
                        >
                          <option value="" disabled>Select Category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Status</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                        >
                          <option value="DRAFT">DRAFT</option>
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Theme Palette</label>
                        <select
                          value={themeColor}
                          onChange={(e) => setThemeColor(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                        >
                          <option value="spartan-red">Spartan Red (Black/Red)</option>
                          <option value="hard-blue">Hard Blue (White/Blue)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Homepage Features</label>
                        <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-none px-4 py-3 h-[46px]">
                          <input
                            type="checkbox"
                            id="isFeatured"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className="w-4 h-4 rounded-none bg-neutral-950 border-neutral-800 text-red-600 focus:ring-0 focus:ring-offset-0"
                          />
                          <label htmlFor="isFeatured" className="text-xs text-neutral-300 font-semibold cursor-pointer">
                            Feature on landing page
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                      <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Gallery Media</label>
                      
                      {/* Hidden file inputs */}
                      <input
                        type="file"
                        id="gallery-file-input"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileInputChange}
                      />
                      <input
                        type="file"
                        id="replace-file-input"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleReplaceFileChange}
                      />

                      {/* Drag and Drop Zone */}
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("gallery-file-input")?.click()}
                        className={`border border-dashed p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                          dragActive
                            ? "border-red-600 bg-red-950/10"
                            : "border-neutral-800 bg-neutral-900/50 hover:border-red-650 hover:bg-red-950/5"
                        }`}
                      >
                        <Upload className={`w-8 h-8 ${dragActive ? "text-red-500 animate-bounce" : "text-neutral-500"}`} />
                        <div>
                          <p className="text-[11px] font-display font-black uppercase tracking-wider text-white">
                            Drag & drop product images, or <span className="text-red-500">browse</span>
                          </p>
                          <p className="text-[9px] text-neutral-500 mt-1 uppercase tracking-widest">
                            JPEG, PNG, WEBP up to 5MB
                          </p>
                        </div>
                      </div>

                      {/* Uploading progress indicator */}
                      {uploadingFiles.length > 0 && (
                        <div className="flex flex-col gap-2.5 bg-neutral-900 border border-neutral-800 p-4">
                          <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider flex items-center gap-1.5">
                            <RefreshCw className="w-3 h-3 animate-spin text-red-500" /> Uploading in progress...
                          </span>
                          <div className="flex flex-col gap-2">
                            {uploadingFiles.map((file) => (
                              <div key={file.id} className="flex flex-col gap-1 text-[10px]">
                                <div className="flex justify-between items-center text-neutral-300 font-mono">
                                  <span className="truncate max-w-[200px]">{file.name}</span>
                                  {file.error ? (
                                    <span className="text-red-500 font-bold">Error: {file.error}</span>
                                  ) : (
                                    <span className="text-neutral-400 font-bold">{file.progress}%</span>
                                  )}
                                </div>
                                {!file.error && (
                                  <div className="w-full bg-neutral-950 h-1.5 border border-neutral-850">
                                    <div
                                      className="bg-red-600 h-full transition-all duration-150"
                                      style={{ width: `${file.progress}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Gallery Previews Grid */}
                      {gallery.length > 0 && (
                        <div className="mt-2.5">
                          <p className="text-[9px] uppercase font-black tracking-wider text-neutral-500 mb-2">
                            Active Images ({gallery.length})
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-900/30 border border-neutral-800 p-4">
                            {gallery.map((item, idx) => {
                              const url = typeof item === "string" ? item : item?.url || "";
                              return (
                                <div
                                  key={idx}
                                  className="group aspect-square bg-[#161616] border border-neutral-800 relative overflow-hidden flex items-center justify-center"
                                >
                                  <img
                                    src={url}
                                    alt={item?.alt || `Gallery image ${idx + 1}`}
                                    className="object-contain w-full h-full p-2"
                                  />
                                  
                                  {/* Overlay with options */}
                                  <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReplaceClick(idx);
                                      }}
                                      className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[9px] font-bold text-neutral-300 hover:text-white transition-all uppercase tracking-wider text-center"
                                    >
                                      Replace
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveGalleryItem(idx);
                                      }}
                                      className="w-full py-1.5 bg-red-600/10 hover:bg-red-600 border border-red-900/30 hover:border-red-650 text-[9px] font-bold text-red-400 hover:text-white transition-all uppercase tracking-wider text-center flex items-center justify-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" /> Remove
                                    </button>
                                  </div>
                                  
                                  {/* Number indicator */}
                                  <div className="absolute top-1.5 left-1.5 bg-neutral-950/80 border border-neutral-800 text-[8px] font-mono text-neutral-400 px-1.5 py-0.5">
                                    #{idx + 1}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Mini Excerpt / Short Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Pure micronized creatine to maximize power output..."
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Full Description / Specifications</label>
                      <textarea
                        placeholder="Write detailed specifications, ingredient splits, usage recommendations..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 h-[178px] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO Accordion */}
                <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-none flex flex-col gap-4">
                  <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-red-500" /> SEO Metadata overrides
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase font-black tracking-wider text-neutral-500">SEO Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Komando Whey Isolate | High Protein Shake"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase font-black tracking-wider text-neutral-500">SEO Keywords</label>
                      <input
                        type="text"
                        placeholder="e.g. protein, isolate, whey, supplements"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase font-black tracking-wider text-neutral-500">SEO Description</label>
                      <input
                        type="text"
                        placeholder="Enter short search-engine snippets..."
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Section: Variants Builder */}
                <div className="border-t border-neutral-800 pt-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-black text-sm uppercase text-white italic">Size & Flavor Variants</h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Configure individual stocks, maximum retail prices (MRP) and active store prices.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVariantRow}
                      className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 font-bold uppercase tracking-wider text-[10px] px-3.5 py-2 rounded-none transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Variant
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {variants.map((v, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-6 gap-3 bg-neutral-900/40 border border-neutral-800 p-4 rounded-none items-end relative">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] uppercase font-black tracking-wider text-neutral-500">Flavor (e.g. Chocolate)</label>
                          <input
                            type="text"
                            placeholder="Flavor"
                            value={v.flavor}
                            onChange={(e) => handleVariantChange(index, "flavor", e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] uppercase font-black tracking-wider text-neutral-500">Size (e.g. 1kg, 250g)</label>
                          <input
                            type="text"
                            placeholder="Size"
                            value={v.size}
                            onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] uppercase font-black tracking-wider text-neutral-500">MRP (INR)</label>
                          <input
                            type="number"
                            placeholder="MRP"
                            value={v.mrp}
                            onChange={(e) => handleVariantChange(index, "mrp", e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-600"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] uppercase font-black tracking-wider text-neutral-500">Sale Price (INR)</label>
                          <input
                            type="number"
                            placeholder="Sale Price"
                            value={v.salePrice}
                            onChange={(e) => handleVariantChange(index, "salePrice", e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-600"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] uppercase font-black tracking-wider text-neutral-500">Available Stock</label>
                          <input
                            type="number"
                            placeholder="Stock"
                            value={v.stock}
                            onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-600"
                            required
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveVariantRow(index)}
                            disabled={variants.length === 1}
                            className="w-full sm:w-auto p-2.5 bg-neutral-955 border border-neutral-800 hover:border-red-900/30 text-neutral-500 hover:text-red-500 rounded-none transition-all flex items-center justify-center"
                            title="Remove Variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-neutral-800 pt-6 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="bg-neutral-900 hover:bg-neutral-850 text-white font-bold uppercase tracking-wider text-[10px] px-6 py-3.5 rounded-none transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-500 font-bold uppercase tracking-wider text-[10px] px-8 py-3.5 rounded-none transition-all flex items-center gap-1.5"
                  >
                    {submittingProduct ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Save Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Creation Overlay Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategoryModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-neutral-950 border border-neutral-800 rounded-none p-6 max-w-md w-full relative z-10 flex flex-col gap-5"
            >
              <div className="flex items-start justify-between pb-2 border-b border-neutral-800">
                <h4 className="font-display font-black text-sm uppercase text-white italic">Create New Category</h4>
                <button onClick={() => setShowCategoryModal(false)} className="text-neutral-500 hover:text-white">
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Category Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Whey Protein"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-black tracking-wider text-neutral-400">Short Description</label>
                  <textarea
                    placeholder="Brief description of products in this category..."
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 h-20 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="bg-neutral-900 hover:bg-neutral-850 text-white font-bold uppercase tracking-wider text-[9px] px-4 py-2.5 rounded-none text-neutral-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingCategory}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-500 font-bold uppercase tracking-wider text-[9px] px-5 py-2.5 rounded-none text-white"
                  >
                    {savingCategory ? "Saving..." : "Create Category"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
