"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { formatPrice } from "@/lib/utils";
import { PRODUCTS, COLLECTIONS, CATEGORIES } from "@/lib/products";

const supabase = createClient();

type Tab = "products" | "categories" | "orders" | "users" | "reviews";

interface AdminReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified?: boolean;
  productId?: string;
  productSlug: string;
  productName: string;
}

interface DBProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  stockCount: number;
  variantLabel: string;
  tagline: string;
  description: string;
  details: string[];
  shippingInfo: string;
  video?: string | null;
}

interface DBCategory {
  name: string;
  description?: string | null;
}

interface DBOrderItem {
  productId?: string;
  name?: string;
  price?: number;
  quantity?: number;
  variant?: string;
}

interface DBOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  items: DBOrderItem[];
  total: number;
  status: string;
  date: string;
}

interface DBProfile {
  email: string;
  fullName?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  createdAt?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Database Data States
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [productsWarning, setProductsWarning] = useState<string | null>(null);
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [users, setUsers] = useState<DBProfile[]>([]);
  const [adminReviews, setAdminReviews] = useState<AdminReview[]>([]);

  // Search & Modals State
  const [productSearch, setProductSearch] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Category addition form
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [catError, setCatError] = useState<string | null>(null);

  // Product Form State
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formCollection, setFormCollection] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formCompareAtPrice, setFormCompareAtPrice] = useState<number | "">("");
  const [formStockCount, setFormStockCount] = useState(0);
  const [formIsNew, setFormIsNew] = useState(false);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formInStock, setFormInStock] = useState(true);
  const [formVariantLabel, setFormVariantLabel] = useState("");
  const [formTagline, setFormTagline] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formShippingInfo, setFormShippingInfo] = useState("");
  const [formVideo, setFormVideo] = useState("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formSizesText, setFormSizesText] = useState("");
  const [formDetailsText, setFormDetailsText] = useState("");
  const [formColors, setFormColors] = useState<{ name: string; hex: string }[]>([]);

  // Temp input for adding single colors in form
  const [tempColorName, setTempColorName] = useState("");
  const [tempColorHex, setTempColorHex] = useState("#000000");

  const loadAdminReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews", { cache: "no-store" });
      if (!res.ok) {
        setAdminReviews([]);
        return;
      }
      const json = await res.json();
      setAdminReviews((json.reviews as AdminReview[]) || []);
    } catch {
      setAdminReviews([]);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const confirmed = window.confirm("Delete this review permanently?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(reviewId)}`, {
        method: "DELETE",
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert("Failed to delete review: " + (result?.error || "Unknown error"));
        return;
      }
      setAdminReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete review.");
    }
  };

  const fetchData = async (opts?: { quiet?: boolean }) => {
    const quiet = !!opts?.quiet;
    if (!quiet) setLoading(true);
    try {
      // Do not call Supabase from the browser — it is unreachable and can hang/break the dashboard.
      const productsRes = await fetch("/api/admin/products", { cache: "no-store" });
      if (productsRes.ok) {
        const productsJson = await productsRes.json();
        setProducts((productsJson.products as DBProduct[]) || []);
        setProductsWarning(
          typeof productsJson.warning === "string" ? productsJson.warning : null
        );
      } else {
        const productsJson = await productsRes.json().catch(() => ({}));
        setProducts([]);
        setProductsWarning(
          typeof productsJson.error === "string"
            ? productsJson.error
            : `Failed to load products (${productsRes.status}).`
        );
      }

      const categoriesRes = await fetch("/api/admin/categories", { cache: "no-store" });
      if (categoriesRes.ok) {
        const categoriesJson = await categoriesRes.json();
        setCategories(
          ((categoriesJson.categories as DBCategory[]) || []).map((c) => ({
            name: c.name,
            description: c.description || `Premium ${c.name} pieces`,
          }))
        );
      } else {
        setCategories(CATEGORIES.map((name) => ({ name, description: `Premium ${name} pieces` })));
      }

      const ordersRes = await fetch("/api/admin/orders", { cache: "no-store" });
      if (ordersRes.ok) {
        const ordersJson = await ordersRes.json();
        setOrders((ordersJson.orders as DBOrder[]) || []);
      } else {
        setOrders([]);
      }

      setUsers([]);
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
      setProducts([]);
      setProductsWarning("Failed to load products due to an unexpected error.");
      setCategories(CATEGORIES.map((name) => ({ name, description: `Premium ${name} pieces` })));
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial dashboard load from admin APIs (async setState is expected).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-time data fetch
    void fetchData();
    void loadAdminReviews();
  }, []);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        router.refresh();
        router.push("/admin/login");
      }
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  // Seeder to populate Database from products.ts mock data
  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      // A. Seed Collections
      const cleanCollections = COLLECTIONS.map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description,
        image: c.image,
      }));
      await supabase.from("collections").upsert(cleanCollections);

      // B. Seed Categories
      const cleanCategories = CATEGORIES.map((cat) => ({
        name: cat,
        description: `Premium ${cat} pieces`,
      }));
      await supabase.from("categories").upsert(cleanCategories);

      // C. Seed Products & Reviews
      for (const product of PRODUCTS) {
        const { reviews, ...productData } = product;
        
        // Match keys properly
        const mappedProduct = {
          id: productData.id,
          slug: productData.slug,
          name: productData.name,
          category: productData.category,
          collection: productData.collection,
          price: productData.price,
          compareAtPrice: productData.compareAtPrice || null,
          images: productData.images,
          colors: productData.colors,
          sizes: productData.sizes,
          rating: productData.rating,
          reviewCount: productData.reviewCount,
          isNew: productData.isNew,
          isBestSeller: productData.isBestSeller,
          inStock: productData.inStock,
          stockCount: productData.stockCount,
          variantLabel: productData.variantLabel,
          tagline: productData.tagline,
          description: productData.description,
          details: productData.details,
          shippingInfo: productData.shippingInfo,
          video: productData.video || null,
        };

        await supabase.from("products").upsert(mappedProduct);

        if (reviews && reviews.length > 0) {
          const mappedReviews = reviews.map((r) => ({
            id: r.id,
            productId: product.id,
            author: r.author,
            rating: r.rating,
            date: r.date,
            title: r.title,
            body: r.body,
            verified: r.verified,
          }));
          await supabase.from("reviews").upsert(mappedReviews);
        }
      }

      // D. Seed Mock Orders
      const mockOrders: DBOrder[] = [
        {
          id: "QS-10482",
          customerName: "Alex Sterling",
          customerEmail: "alex@sterling.com",
          total: 185,
          status: "Delivered",
          date: "2026-06-18",
          items: [{ productId: "1", name: "The Arachnid Requiem", price: 185, quantity: 1, variant: "Aged Sterling Silver" }],
        },
        {
          id: "QS-10311",
          customerName: "M. Ashworth",
          customerEmail: "ashworth@example.com",
          total: 302,
          status: "Shipped",
          date: "2026-05-02",
          items: [
            { productId: "2", name: "The Midnight Glow", price: 210, quantity: 1, variant: "Crimson Variant" },
            { productId: "5", name: "Cathedral Cuff", price: 92, quantity: 1, variant: "Aged Sterling Silver" },
          ],
        },
      ];
      await supabase.from("orders").upsert(mockOrders);

      // E. Seed Mock User Profiles
      const mockProfiles: DBProfile[] = [
        {
          email: "alex@sterling.com",
          fullName: "Alex Sterling",
          address: "14 Cathedral Row, Suite 3",
          city: "New Haven Quarter",
          postalCode: "NH 06510",
        },
        {
          email: "ashworth@example.com",
          fullName: "M. Ashworth",
          address: "42 Baker Street",
          city: "London",
          postalCode: "NW1 6XE",
        },
      ];
      await supabase.from("profiles").upsert(mockProfiles);

      alert("Database seeded successfully with collections, products, reviews, orders, and profiles!");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to seed database.");
    } finally {
      setSeeding(false);
    }
  };

  // Add Category Handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatError(null);
    if (!newCatName.trim()) return;

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          description: newCatDesc.trim(),
        }),
      });
      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        setCatError(result?.error || "Failed to add category");
        return;
      }

      setNewCatName("");
      setNewCatDesc("");
      await fetchData({ quiet: true });
      alert(
        result?.warning
          ? `Category saved.\n\n${result.warning}`
          : `"${result?.category?.name || "Category"}" saved to Supabase and is now live on the store.`
      );
    } catch (err) {
      console.error(err);
      setCatError("Failed to add category");
    }
  };

  const handleDeleteCategory = async (name: string) => {
    const confirmed = window.confirm(
      `Delete category "${name}"? Products using it will keep their category label until you edit them.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/admin/categories?name=${encodeURIComponent(name)}`,
        { method: "DELETE" }
      );
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert("Failed to delete category: " + (result?.error || "Unknown error"));
        return;
      }
      setCategories((prev) => prev.filter((c) => c.name !== name));
    } catch (err) {
      console.error(err);
      alert("Failed to delete category due to an unexpected error.");
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert("Failed to update status: " + (result?.error || "Unknown error"));
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  const handleDeleteProduct = async (p: DBProduct) => {
    const confirmed = window.confirm(
      `Delete "${p.name}" permanently? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(p.id)}`, {
        method: "DELETE",
      });
      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert("Failed to delete product: " + (result?.error || "Unknown error"));
        return;
      }

      setProducts((prev) => prev.filter((item) => item.id !== p.id));
      if (isProductModalOpen && formId === p.id) {
        setIsProductModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete product due to an unexpected error.");
    }
  };

  // Open Add Product Modal
  const openAddProductModal = () => {
    setIsNewProduct(true);
    setFormId(Math.floor(1000 + Math.random() * 9000).toString());
    setFormName("");
    setFormSlug("");
    setFormCategory(categories[0]?.name || CATEGORIES[0] || "");
    setFormCollection(COLLECTIONS[0]?.slug || "");
    setFormPrice(0);
    setFormCompareAtPrice("");
    setFormStockCount(10);
    setFormIsNew(true);
    setFormIsBestSeller(false);
    setFormInStock(true);
    setFormVariantLabel("");
    setFormTagline("");
    setFormDescription("");
    setFormShippingInfo("Ships in 2–4 business days. Free returns within 30 days.");
    setFormVideo("");
    setFormImages([]);
    setFormSizesText("18\", 20\", 22\"");
    setFormDetailsText("");
    setFormColors([]);
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const openEditProductModal = (p: DBProduct) => {
    setIsNewProduct(false);
    setFormId(p.id);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormCategory(p.category);
    setFormCollection(p.collection || "");
    setFormPrice(p.price);
    setFormCompareAtPrice(p.compareAtPrice || "");
    setFormStockCount(p.stockCount);
    setFormIsNew(p.isNew);
    setFormIsBestSeller(p.isBestSeller);
    setFormInStock(p.inStock);
    setFormVariantLabel(p.variantLabel || "");
    setFormTagline(p.tagline || "");
    setFormDescription(p.description || "");
    setFormShippingInfo(p.shippingInfo || "");
    setFormVideo(p.video || "");
    setFormImages(p.images || []);
    setFormSizesText(p.sizes?.join(", ") || "");
    setFormDetailsText(p.details?.join("\n") || "");
    setFormColors(p.colors || []);
    setIsProductModalOpen(true);
  };

  // Add/Remove color helper inside Form
  const addColorToForm = () => {
    if (!tempColorName.trim()) return;
    setFormColors([...formColors, { name: tempColorName.trim(), hex: tempColorHex }]);
    setTempColorName("");
    setTempColorHex("#000000");
  };

  const removeColorFromForm = (index: number) => {
    setFormColors(formColors.filter((_, i) => i !== index));
  };

  // Upload product images through authenticated admin API (service-role storage)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be 5MB or smaller.");
      e.target.value = "";
      return;
    }

    setUploadingImage(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.url) {
        alert(data?.error || "Upload failed. Please try again.");
        return;
      }

      setFormImages((prev) => [...prev, data.url as string]);
      if (typeof data.warning === "string" && data.warning) {
        console.warn(data.warning);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Error uploading image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Product Save/Update Form Submit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formId.trim() || !formName.trim() || !formCategory.trim()) {
      alert("Please fill Product ID, Name, and Category before saving.");
      return;
    }

    const resolvedDescription = formDescription.trim() || "Premium handcrafted piece from the Qusay vault.";

    const productPayload = {
      id: formId,
      name: formName.trim(),
      slug: formSlug.trim() || formName.trim().toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      category: formCategory,
      collection: formCollection || null,
      price: Number(formPrice),
      compareAtPrice: formCompareAtPrice === "" ? null : Number(formCompareAtPrice),
      stockCount: Number(formStockCount),
      isNew: formIsNew,
      isBestSeller: formIsBestSeller,
      inStock: formInStock,
      variantLabel: formVariantLabel.trim(),
      tagline: formTagline.trim(),
      description: resolvedDescription,
      shippingInfo: formShippingInfo.trim(),
      video: formVideo.trim() || null,
      images: formImages,
      sizes: formSizesText.split(",").map(s => s.trim()).filter(Boolean),
      details: formDetailsText.split("\n").map(d => d.trim()).filter(Boolean),
      colors: formColors,
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });
      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert("Failed to save product: " + (result?.error || "Unknown error"));
      } else {
        setIsProductModalOpen(false);
        // Quiet refresh: avoid full-page "Retrieving Vault Data..." spinner after a successful save.
        void fetchData({ quiet: true });
        alert(
          result?.warning
            ? `Piece saved.\n\n${result.warning}`
            : "Piece saved to Supabase and is now visible in the store."
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save product due to an unexpected error.");
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.slug.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F2EF] font-sans flex flex-col relative pt-20 md:pt-24">
      <div className="bg-noise" />

      {/* Header — sits below the site navbar on all screens */}
      <header className="border-b border-white/[0.08] bg-[#170909]/80 backdrop-blur-md sticky top-20 md:top-24 z-30 px-4 sm:px-6 py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-heading text-xl sm:text-2xl tracking-widest text-[#F5F2EF]">QUSAY</span>
          <span className="text-[10px] uppercase bg-[#E50914]/20 text-[#E50914] px-2 py-0.5 border border-[#E50914]/30 tracking-widest whitespace-nowrap">
            Vault Dashboard
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Link
            id="admin-storefront-btn"
            href="/"
            className="border border-white/[0.1] hover:border-[#E50914] hover:text-[#E50914] bg-transparent text-[#F5F2EF]/60 px-3 sm:px-4 py-2 text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
          >
            Go to Store
          </Link>
          <button
            id="admin-seed-btn"
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="border border-[#E50914] bg-[#E50914]/10 hover:bg-[#E50914] text-[#F5F2EF] px-3 sm:px-4 py-2 text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {seeding ? "Seeding..." : "Seed Database"}
          </button>
          <button
            id="admin-signout-btn"
            onClick={handleSignOut}
            className="border border-white/[0.1] hover:border-[#E50914] hover:text-[#E50914] bg-transparent text-[#F5F2EF]/60 px-3 sm:px-4 py-2 text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid md:grid-cols-[240px_1fr] relative">
        {/* Sidebar */}
        <aside className="border-r border-white/[0.08] bg-[#141414] p-6 space-y-6">
          <div className="space-y-1">
            <p className="font-heading text-sm text-[#F5F2EF]/40 uppercase tracking-widest">Navigation</p>
            <nav className="flex flex-col gap-1.5 pt-3">
              {(["products", "categories", "orders", "users", "reviews"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-left px-4 py-3 text-xs uppercase tracking-widest transition-all duration-200 border-l-2 cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#E50914]/10 text-[#E50914] border-[#E50914]"
                      : "text-[#F5F2EF]/50 hover:text-[#F5F2EF] hover:bg-white/[0.02] border-transparent"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="border-t border-white/[0.08] pt-6 space-y-3">
            <p className="font-heading text-xs text-[#F5F2EF]/40 uppercase tracking-widest">System Overview</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#170909] border border-white/[0.04] p-3 rounded-sm">
                <p className="text-xl font-heading text-[#E50914]">{products.length}</p>
                <p className="text-[9px] uppercase tracking-wider text-[#F5F2EF]/40">Products</p>
              </div>
              <div className="bg-[#170909] border border-white/[0.04] p-3 rounded-sm">
                <p className="text-xl font-heading text-[#E50914]">{orders.length}</p>
                <p className="text-[9px] uppercase tracking-wider text-[#F5F2EF]/40">Orders</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="p-8 md:p-10 overflow-y-auto">
          {loading ? (
            <div className="h-64 flex items-center justify-center flex-col gap-3">
              <span className="w-8 h-8 border-3 border-[#E50914] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs uppercase tracking-widest text-[#F5F2EF]/40">Retrieving Vault Data...</p>
            </div>
          ) : (
            <>
              {/* PRODUCTS TAB */}
              {activeTab === "products" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-heading text-3xl text-[#F5F2EF]">Product Inventory</h2>
                      <p className="text-xs text-[#F5F2EF]/50 mt-1">Manage and update all pieces of the vault.</p>
                    </div>
                    <button
                      id="admin-add-product-btn"
                      onClick={openAddProductModal}
                      className="border border-[#E50914] bg-[#E50914]/15 hover:bg-[#E50914] text-[#F5F2EF] px-5 py-3 text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer self-start"
                    >
                      Add New Product
                    </button>
                  </div>

                  {/* Filter / Search */}
                  <div className="relative max-w-md">
                    <input
                      id="admin-product-search-input"
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search by name, slug, or category..."
                      className="w-full bg-[#170909] border border-white/[0.08] px-4 py-3 pl-10 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 transition-all font-sans"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
                  </div>

                  {/* Products Grid */}
                  {products.length === 0 ? (
                    <div className="border border-[#E50914]/20 p-12 text-center bg-[#170909]/60 space-y-4">
                      <p className="text-sm text-[#F5F2EF]/60">Your Supabase database is currently empty.</p>
                      {productsWarning && (
                        <p className="text-xs text-amber-400/80 max-w-md mx-auto">{productsWarning}</p>
                      )}
                      <button
                        onClick={handleSeedDatabase}
                        disabled={seeding}
                        className="border border-[#E50914] bg-[#E50914]/20 hover:bg-[#E50914] text-[#F5F2EF] px-5 py-2.5 text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
                      >
                        {seeding ? "Importing Data..." : "Import All Mock Products & Categories"}
                      </button>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="border border-white/[0.06] p-12 text-center bg-[#170909]/40">
                      <p className="text-sm text-[#F5F2EF]/50">No products found matching your search.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((p) => (
                        <div key={p.id} className="border border-white/[0.08] bg-[#170909]/50 p-4 flex flex-col justify-between group">
                          <div>
                            <div className="relative aspect-[4/5] bg-black rounded-sm overflow-hidden mb-3">
                              {p.images && p.images[0] ? (
                                <Image
                                  src={p.images[0]}
                                  alt={p.name}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-[#F5F2EF]/30 bg-[#222]">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-heading text-lg text-[#F5F2EF] truncate">{p.name}</h3>
                                <span className="font-mono text-sm text-[#E50914] font-semibold">{formatPrice(p.price)}</span>
                              </div>
                              <p className="text-[10px] uppercase tracking-wider text-[#F5F2EF]/40">{p.category}</p>
                              <div className="flex gap-2 pt-2">
                                {p.isNew && (
                                  <span className="text-[8px] uppercase tracking-wider bg-green-950/40 text-green-400 border border-green-800/40 px-1.5 py-0.5">
                                    New
                                  </span>
                                )}
                                {p.isBestSeller && (
                                  <span className="text-[8px] uppercase tracking-wider bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 px-1.5 py-0.5">
                                    Best Seller
                                  </span>
                                )}
                                <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 border ${
                                  p.inStock 
                                    ? "bg-zinc-900 text-[#F5F2EF]/60 border-white/[0.08]" 
                                    : "bg-red-950/20 text-red-500 border-red-800/20"
                                }`}>
                                  Stock: {p.stockCount}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 mt-4 border-t border-white/[0.06] flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEditProductModal(p)}
                              className="flex-1 border border-white/[0.08] hover:border-[#E50914] hover:text-[#E50914] text-xs uppercase py-2 tracking-wider transition-all duration-200 cursor-pointer text-center"
                            >
                              Edit Piece
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteProduct(p)}
                              className="border border-red-900/50 hover:border-red-500 hover:bg-red-950/40 text-red-400 hover:text-red-300 text-xs uppercase px-3 py-2 tracking-wider transition-all duration-200 cursor-pointer text-center"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CATEGORIES TAB */}
              {activeTab === "categories" && (
                <div className="space-y-8 max-w-3xl">
                  <div>
                    <h2 className="font-heading text-3xl text-[#F5F2EF]">Store Categories</h2>
                    <p className="text-xs text-[#F5F2EF]/50 mt-1">Add and view product classifications.</p>
                  </div>

                  <div className="grid md:grid-cols-[1fr_320px] gap-8">
                    {/* Categories List */}
                    <div className="border border-white/[0.08] bg-[#170909]/40 p-6 space-y-4">
                      <h3 className="font-heading text-lg text-[#F5F2EF]">Active Categories</h3>
                      {categories.length === 0 ? (
                        <p className="text-xs text-[#F5F2EF]/40">No categories found. Seed data to populate.</p>
                      ) : (
                        <div className="divide-y divide-white/[0.06]">
                          {categories.map((c) => (
                            <div key={c.name} className="py-3 flex justify-between items-center gap-4">
                              <div>
                                <p className="font-sans text-sm font-semibold text-[#F5F2EF]">{c.name}</p>
                                <p className="font-sans text-xs text-[#F5F2EF]/40 mt-0.5">{c.description || "No description"}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => void handleDeleteCategory(c.name)}
                                className="border border-red-900/50 hover:border-red-500 text-red-400 hover:text-red-300 text-[10px] uppercase tracking-wider px-2.5 py-1.5 transition-all cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add Category Form */}
                    <div className="border border-white/[0.08] bg-[#170909]/70 p-6 self-start space-y-5">
                      <h3 className="font-heading text-lg text-[#F5F2EF]">Add Category</h3>
                      {catError && (
                        <p className="text-xs text-red-500 bg-red-950/20 border border-red-800/30 p-2 text-center">
                          {catError}
                        </p>
                      )}
                      <form onSubmit={handleAddCategory} className="space-y-4">
                        <div>
                          <label className="block font-sans text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1.5">
                            Category Name
                          </label>
                          <input
                            type="text"
                            required
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 transition-all"
                            placeholder="e.g. Rings"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1.5">
                            Description
                          </label>
                          <textarea
                            value={newCatDesc}
                            onChange={(e) => setNewCatDesc(e.target.value)}
                            className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 transition-all h-20 resize-none"
                            placeholder="Brief description..."
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full border border-[#E50914] bg-[#E50914]/10 hover:bg-[#E50914] text-[#F5F2EF] py-2.5 text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
                        >
                          Add Category
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-3xl text-[#F5F2EF]">Purchase History</h2>
                    <p className="text-xs text-[#F5F2EF]/50 mt-1">Track and manage customer receipts.</p>
                  </div>

                  <div className="border border-white/[0.08] bg-[#170909]/40 overflow-hidden">
                    {orders.length === 0 ? (
                      <div className="p-12 text-center">
                        <p className="text-sm text-[#F5F2EF]/40">No orders recorded in database.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/[0.08] bg-black/20 text-[10px] uppercase tracking-wider text-[#F5F2EF]/40">
                              <th className="p-4 pl-6">Order ID</th>
                              <th className="p-4">Date</th>
                              <th className="p-4">Customer</th>
                              <th className="p-4">Items Summary</th>
                              <th className="p-4">Total</th>
                              <th className="p-4">Status</th>
                              <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.06] text-xs">
                            {orders.map((o) => (
                              <tr key={o.id} className="hover:bg-white/[0.01] transition-colors">
                                <td className="p-4 pl-6 font-mono font-semibold text-[#E50914]">{o.id}</td>
                                <td className="p-4 text-[#F5F2EF]/60">{o.date}</td>
                                <td className="p-4">
                                  <p className="font-semibold">{o.customerName}</p>
                                  <p className="text-[10px] text-[#F5F2EF]/40">{o.customerEmail}</p>
                                </td>
                                <td className="p-4 max-w-xs truncate">
                                  {o.items?.map((item, idx: number) => (
                                    <span key={idx}>
                                      {item.name} ({item.quantity}x{item.variant ? ` - ${item.variant}` : ""})
                                      {idx < o.items.length - 1 ? ", " : ""}
                                    </span>
                                  )) || "No items"}
                                </td>
                                <td className="p-4 font-mono font-semibold">{formatPrice(o.total)}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 border text-[9px] uppercase tracking-wider ${
                                    o.status === "Delivered"
                                      ? "bg-green-950/20 text-green-400 border-green-800/30"
                                      : o.status === "Shipped"
                                      ? "bg-blue-950/20 text-blue-400 border-blue-800/30"
                                      : "bg-amber-950/20 text-amber-400 border-amber-800/30"
                                  }`}>
                                    {o.status}
                                  </span>
                                </td>
                                <td className="p-4 pr-6 text-right">
                                  <select
                                    value={o.status}
                                    onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                    className="bg-[#070707] border border-white/[0.08] px-2 py-1 text-[11px] text-[#F5F2EF] outline-none focus:border-[#E50914]"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-3xl text-[#F5F2EF]">User Registry</h2>
                    <p className="text-xs text-[#F5F2EF]/50 mt-1">View list of registered profiles and addresses.</p>
                  </div>

                  <div className="border border-white/[0.08] bg-[#170909]/40 overflow-hidden">
                    {users.length === 0 ? (
                      <div className="p-12 text-center">
                        <p className="text-sm text-[#F5F2EF]/40">No registered profiles in database.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/[0.08] bg-black/20 text-[10px] uppercase tracking-wider text-[#F5F2EF]/40">
                              <th className="p-4 pl-6">Email</th>
                              <th className="p-4">Full Name</th>
                              <th className="p-4">Default Shipping Address</th>
                              <th className="p-4">City</th>
                              <th className="p-4">Postal Code</th>
                              <th className="p-4 pr-6">Joined Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.06] text-xs">
                            {users.map((u) => (
                              <tr key={u.email} className="hover:bg-white/[0.01] transition-colors">
                                <td className="p-4 pl-6 font-semibold text-[#E50914]">{u.email}</td>
                                <td className="p-4">{u.fullName || "Not provided"}</td>
                                <td className="p-4 text-[#F5F2EF]/75">{u.address || "Not provided"}</td>
                                <td className="p-4">{u.city || "-"}</td>
                                <td className="p-4 font-mono">{u.postalCode || "-"}</td>
                                <td className="p-4 pr-6 text-[#F5F2EF]/40">
                                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === "reviews" && (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-heading text-3xl text-[#F5F2EF]">Customer Reviews</h2>
                      <p className="text-xs text-[#F5F2EF]/50 mt-1">
                        Moderate and delete customer reviews submitted from the storefront.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void loadAdminReviews()}
                      className="border border-white/[0.08] hover:border-[#E50914] text-[#F5F2EF]/60 hover:text-[#E50914] px-4 py-2 text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer self-start"
                    >
                      Refresh Reviews
                    </button>
                  </div>

                  <div className="border border-white/[0.08] bg-[#170909]/40 overflow-hidden">
                    {adminReviews.length === 0 ? (
                      <div className="p-12 text-center">
                        <p className="text-sm text-[#F5F2EF]/40 mb-2">No reviews found.</p>
                        <p className="text-xs text-[#F5F2EF]/25">
                          Customers can leave reviews from the home page or product pages.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-white/[0.08] bg-black/20 text-[10px] uppercase tracking-wider text-[#F5F2EF]/40">
                              <th className="p-4 pl-6">Product</th>
                              <th className="p-4">Author</th>
                              <th className="p-4">Rating</th>
                              <th className="p-4">Title</th>
                              <th className="p-4">Review</th>
                              <th className="p-4">Date</th>
                              <th className="p-4">Verified</th>
                              <th className="p-4 pr-6 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.06] text-xs">
                            {adminReviews.map((r) => (
                              <tr key={r.id} className="hover:bg-white/[0.01] transition-colors">
                                <td className="p-4 pl-6">
                                  <span className="font-semibold text-[#E50914]">{r.productName || "Unknown"}</span>
                                  <br />
                                  <span className="text-[10px] text-[#F5F2EF]/30 font-mono">{r.productSlug}</span>
                                </td>
                                <td className="p-4 text-[#F5F2EF]/80 font-semibold">{r.author}</td>
                                <td className="p-4">
                                  <span className="flex items-center gap-0.5 text-[#E50914] text-sm">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <span key={i} className={i < r.rating ? "text-[#E50914]" : "text-white/10"}>
                                        ★
                                      </span>
                                    ))}
                                  </span>
                                  <span className="text-[10px] text-[#F5F2EF]/30 mt-0.5 block">{r.rating}/5</span>
                                </td>
                                <td className="p-4 text-[#F5F2EF] font-heading">{r.title}</td>
                                <td className="p-4 text-[#F5F2EF]/60 max-w-xs">
                                  <span className="line-clamp-2 leading-relaxed">{r.body}</span>
                                </td>
                                <td className="p-4 text-[#F5F2EF]/40 whitespace-nowrap">{r.date}</td>
                                <td className="p-4">
                                  {r.verified ? (
                                    <span className="text-[10px] text-emerald-400 border border-emerald-800/50 bg-emerald-950/30 px-2 py-0.5 uppercase tracking-widest">
                                      Verified
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-[#F5F2EF]/30">—</span>
                                  )}
                                </td>
                                <td className="p-4 pr-6 text-right">
                                  <button
                                    type="button"
                                    onClick={() => void handleDeleteReview(r.id)}
                                    className="border border-[#E50914]/50 bg-[#E50914]/10 hover:bg-[#E50914] text-[#E50914] hover:text-white px-3 py-1.5 text-[10px] uppercase tracking-widest transition-all duration-200 cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="border-t border-white/[0.06] px-6 py-3 flex flex-wrap gap-6 text-[10px] uppercase tracking-widest text-[#F5F2EF]/40">
                      <span>
                        Total: {adminReviews.length} review{adminReviews.length !== 1 ? "s" : ""}
                      </span>
                      <span>
                        Avg Rating:{" "}
                        {adminReviews.length > 0
                          ? (
                              adminReviews.reduce((sum, r) => sum + r.rating, 0) / adminReviews.length
                            ).toFixed(1)
                          : "—"}{" "}
                        / 5
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* PRODUCT ADD/EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 overflow-y-auto">
          <div className="bg-[#170909] border border-white/[0.08] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="font-heading text-2xl text-[#F5F2EF]">
                {isNewProduct ? "Forging New Piece" : `Modifying Piece: ${formName}`}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-2xl text-[#F5F2EF]/40 hover:text-white cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleProductSubmit}
              noValidate
              className="space-y-6"
            >
              {/* Product Basic Fields */}
              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    Product ID
                  </label>
                  <input
                    type="text"
                    required
                    readOnly={!isNewProduct}
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 read-only:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50"
                    placeholder="e.g. Cathedral Pendant"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50"
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    Category
                  </label>
                  <select
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]"
                  >
                    <option value="" disabled>-- Choose Category --</option>
                    {(categories.length > 0 ? categories.map((c) => c.name) : CATEGORIES).map((catName) => (
                      <option key={catName} value={catName}>
                        {catName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    Collection
                  </label>
                  <select
                    value={formCollection}
                    onChange={(e) => setFormCollection(e.target.value)}
                    className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]"
                  >
                    <option value="">No Collection</option>
                    {COLLECTIONS.map((col) => (
                      <option key={col.slug} value={col.slug}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    Compare At Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formCompareAtPrice}
                    onChange={(e) =>
                      setFormCompareAtPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 font-mono"
                    placeholder="None"
                  />
                </div>
              </div>

              {/* Status and Stock Details */}
              <div className="grid md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    Stock Count
                  </label>
                  <input
                    type="number"
                    required
                    value={formStockCount}
                    onChange={(e) => setFormStockCount(Number(e.target.value))}
                    className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 font-mono"
                  />
                </div>
                <div className="flex items-end gap-2 pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                    <input
                      type="checkbox"
                      checked={formInStock}
                      onChange={(e) => setFormInStock(e.target.checked)}
                      className="accent-[#E50914] w-4 h-4"
                    />
                    <span>Available In Stock</span>
                  </label>
                </div>
                <div className="flex items-end gap-2 pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                    <input
                      type="checkbox"
                      checked={formIsNew}
                      onChange={(e) => setFormIsNew(e.target.checked)}
                      className="accent-[#E50914] w-4 h-4"
                    />
                    <span>Tag as New</span>
                  </label>
                </div>
                <div className="flex items-end gap-2 pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                    <input
                      type="checkbox"
                      checked={formIsBestSeller}
                      onChange={(e) => setFormIsBestSeller(e.target.checked)}
                      className="accent-[#E50914] w-4 h-4"
                    />
                    <span>Tag as Best Seller</span>
                  </label>
                </div>
              </div>

              {/* Info texts */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50"
                    placeholder="Brief highlight description"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    Variant Label
                  </label>
                  <input
                    type="text"
                    value={formVariantLabel}
                    onChange={(e) => setFormVariantLabel(e.target.value)}
                    className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50"
                    placeholder="e.g. Sterling Silver"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50 h-24"
                  placeholder="Detailed explanation..."
                />
              </div>

              {/* Lists Section: Images, Sizes, Details, and Colors */}
              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/[0.08]">
                <div className="space-y-3">
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    Product Images
                  </label>
                  
                  {/* Upload button wrapper */}
                  <div className="relative border border-dashed border-white/[0.08] hover:border-[#E50914]/60 transition-colors p-4 text-center cursor-pointer flex flex-col items-center justify-center gap-1 bg-[#1A0A0A]">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {uploadingImage ? (
                      <span className="w-5 h-5 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin mb-1" />
                    ) : (
                      <span className="text-xl text-[#E50914]">📤</span>
                    )}
                    <span className="text-xs font-semibold text-[#F5F2EF]">
                      {uploadingImage ? "Uploading image..." : "Upload Image from Device"}
                    </span>
                    <span className="text-[9px] text-[#F5F2EF]/40 uppercase tracking-wide">
                      PNG, JPG, WEBP up to 5MB
                    </span>
                  </div>

                  {/* Thumbnail Previews */}
                  {formImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {formImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative aspect-square border border-white/[0.08] bg-black group rounded-sm overflow-hidden">
                          <Image
                            src={imgUrl}
                            alt="Preview"
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] text-red-500 font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    Craft Details / Specs (One item per line)
                  </label>
                  <textarea
                    value={formDetailsText}
                    onChange={(e) => setFormDetailsText(e.target.value)}
                    className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-xs text-[#F5F2EF] outline-none focus:border-[#E50914]/50 h-28"
                    placeholder="e.g. Cast in oxidized sterling silver"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    Sizes (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formSizesText}
                    onChange={(e) => setFormSizesText(e.target.value)}
                    className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50"
                    placeholder="e.g. 18&quot;, 20&quot;, 22&quot;"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#F5F2EF]/40 mb-1">
                    Shipping & Returns Details
                  </label>
                  <input
                    type="text"
                    value={formShippingInfo}
                    onChange={(e) => setFormShippingInfo(e.target.value)}
                    className="w-full bg-[#1A0A0A] border border-white/[0.08] px-3 py-2 text-sm text-[#F5F2EF] outline-none focus:border-[#E50914]/50"
                  />
                </div>
              </div>

              {/* Dynamic Color Palette Picker */}
              <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                <h4 className="font-heading text-sm text-[#F5F2EF] uppercase tracking-widest">Color Options</h4>
                <div className="flex flex-wrap gap-2">
                  {formColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="border border-white/[0.08] px-2.5 py-1.5 flex items-center gap-2 bg-[#1A0A0A] text-xs text-[#F5F2EF]"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/30" style={{ backgroundColor: color.hex }} />
                      <span>{color.name} ({color.hex})</span>
                      <button
                        type="button"
                        onClick={() => removeColorFromForm(idx)}
                        className="text-red-500 hover:text-red-300 font-bold ml-1 cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-[1fr_100px_100px] gap-3 max-w-lg">
                  <input
                    type="text"
                    value={tempColorName}
                    onChange={(e) => setTempColorName(e.target.value)}
                    className="bg-[#1A0A0A] border border-white/[0.08] px-3 py-1.5 text-xs text-[#F5F2EF] outline-none focus:border-[#E50914]/50"
                    placeholder="Color Name (e.g. Aged Silver)"
                  />
                  <input
                    type="color"
                    value={tempColorHex}
                    onChange={(e) => setTempColorHex(e.target.value)}
                    className="w-full h-8 bg-transparent border-0 cursor-pointer p-0"
                  />
                  <button
                    type="button"
                    onClick={addColorToForm}
                    className="border border-white/[0.08] bg-[#1A0A0A] text-[#F5F2EF] hover:border-[#E50914] text-xs uppercase px-3 py-1.5 transition-all duration-200 cursor-pointer"
                  >
                    Add Option
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="border border-white/[0.08] bg-transparent text-[#F5F2EF]/60 px-5 py-3 text-xs uppercase tracking-widest hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="admin-save-piece-btn"
                  onClick={(e) => {
                    void handleProductSubmit(e as unknown as React.FormEvent);
                  }}
                  className="border border-[#E50914] bg-[#E50914]/20 hover:bg-[#E50914] text-[#F5F2EF] px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
                >
                  Save Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
