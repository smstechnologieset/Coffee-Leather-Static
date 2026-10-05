'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, ArrowLeft, X, Save, Image as ImageIcon, Upload, Sparkles, Check } from 'lucide-react';
import {
  DEFAULT_SAMPLE_TIERS,
  SampleTier,
  CoffeeProduct,
  IMAGE_PRESETS,
  getStoredProducts,
  upsertStoredProduct,
  deleteStoredProduct,
} from '@/lib/products-data';
import OrderNowProductsTab from '@/components/admin/OrderNowProductsTab';

const BASE_CATEGORIES = [
  { id: '1', name: 'Washed Coffees', process: 'Washed', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80' },
  { id: '2', name: 'Natural Coffees', process: 'Natural', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80' },
  { id: '3', name: 'Honey Process', process: 'Honey', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80' },
];

const SUGGESTED_REGIONS = [
  'Yirgacheffe',
  'Sidamo',
  'Harar',
  'Limu',
  'Guji',
  'Jimma',
  'Keffa',
  'Bale',
  'Bench Maji',
  'Arsi',
];

export default function ProductsSection() {
  const [activeProductTab, setActiveProductTab] = useState<'commercial' | 'order-now'>('commercial');
  const [categories, setCategories] = useState(BASE_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<typeof BASE_CATEGORIES[0] | null>(null);
  const [allProducts, setAllProducts] = useState<CoffeeProduct[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CoffeeProduct | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productForm, setProductForm] = useState<{
    name: string;
    region: string;
    process: string;
    grade: string;
    pricePerQuintal: number;
    minOrderQuintals: number;
    availability: string;
    image: string;
    profile: string;
    isTopProduct: boolean;
    sampleTiers: SampleTier[];
  }>({
    name: '',
    region: 'Yirgacheffe',
    process: 'Washed',
    grade: 'Grade 1',
    pricePerQuintal: 420,
    minOrderQuintals: 10,
    availability: 'In Stock',
    image: IMAGE_PRESETS[0].url,
    profile: 'Floral jasmine, bergamot, lemon zest, clean sweet finish',
    isTopProduct: false,
    sampleTiers: DEFAULT_SAMPLE_TIERS,
  });

  // Load products from persistent store
  useEffect(() => {
    const load = () => {
      setAllProducts(getStoredProducts());
    };
    load();

    window.addEventListener('kijij_products_updated', load);
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener('kijij_products_updated', load);
      window.removeEventListener('storage', load);
    };
  }, []);

  // Filter products for the current selected category
  const catProducts = selectedCategory
    ? allProducts.filter(
        (p) =>
          p.process?.toLowerCase() === selectedCategory.process.toLowerCase() ||
          p.category?.toLowerCase() === selectedCategory.process.toLowerCase()
      )
    : allProducts;

  const handleDeleteProduct = (productId: string) => {
    if (!confirm('Are you sure you want to delete this coffee product from the catalog?')) return;
    deleteStoredProduct(productId);
    setAllProducts(getStoredProducts());
  };

  const handleSaveProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productForm.name.trim()) {
      alert('Please enter a product name.');
      return;
    }

    const saved = upsertStoredProduct({
      id: editingProduct?.id,
      name: productForm.name.trim(),
      region: productForm.region.trim() || 'Yirgacheffe',
      process: productForm.process as any,
      category: productForm.process,
      grade: productForm.grade,
      pricePerQuintal: Number(productForm.pricePerQuintal) || 400,
      minOrderQuintals: Number(productForm.minOrderQuintals) || 5,
      availability: productForm.availability as any,
      image: productForm.image.trim() || IMAGE_PRESETS[0].url,
      profile: productForm.profile.trim(),
      isTopProduct: productForm.isTopProduct,
      sampleTiers: productForm.sampleTiers,
    });

    setAllProducts(getStoredProducts());
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    const targetProcess = selectedCategory?.process || 'Washed';
    const preset =
      targetProcess === 'Natural'
        ? IMAGE_PRESETS[1]
        : targetProcess === 'Honey'
        ? IMAGE_PRESETS[5]
        : IMAGE_PRESETS[0];

    setProductForm({
      name: '',
      region: 'Yirgacheffe',
      process: targetProcess,
      grade: 'Grade 1',
      pricePerQuintal: 420,
      minOrderQuintals: 10,
      availability: 'In Stock',
      image: preset.url,
      profile: 'Floral jasmine, bergamot, lemon zest, clean sweet finish',
      isTopProduct: false,
      sampleTiers: [
        { id: 'st-250g', size: '250g', price: 0, isFree: true },
        { id: 'st-500g', size: '500g', price: 0, isFree: true },
        { id: 'st-1kg', size: '1kg', price: 15, isFree: false },
        { id: 'st-2kg', size: '2kg', price: 25, isFree: false },
      ],
    });
    setShowProductModal(true);
  };

  const openEditProduct = (product: CoffeeProduct) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      region: product.region || 'Yirgacheffe',
      process: product.process || 'Washed',
      grade: product.grade || 'Grade 1',
      pricePerQuintal: product.pricePerQuintal || product.currentPrice || 420,
      minOrderQuintals: product.minOrderQuintals || 10,
      availability: product.availability || 'In Stock',
      image: product.image || IMAGE_PRESETS[0].url,
      profile: product.profile || '',
      isTopProduct: Boolean(product.isTopProduct),
      sampleTiers: product.sampleTiers?.length ? product.sampleTiers : DEFAULT_SAMPLE_TIERS,
    });
    setShowProductModal(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file is too large (maximum 5MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        setProductForm((prev) => ({ ...prev, image: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateSampleTier = (index: number, field: keyof SampleTier, value: any) => {
    setProductForm((prev) => {
      const updated = [...prev.sampleTiers];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'isFree' && value === true) {
        updated[index].price = 0;
      }
      return { ...prev, sampleTiers: updated };
    });
  };

  const handleAddSampleTier = () => {
    setProductForm((prev) => ({
      ...prev,
      sampleTiers: [
        ...prev.sampleTiers,
        { id: `st-${Date.now()}`, size: '250g', price: 0, isFree: true },
      ],
    }));
  };

  const handleRemoveSampleTier = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      sampleTiers: prev.sampleTiers.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      {/* ── Top Level Product Tabs: Commercial vs Order Now ── */}
      <div className="flex items-center gap-3 border-b border-neutral-200 pb-4 mb-6">
        <button
          onClick={() => {
            setActiveProductTab('commercial');
            setSelectedCategory(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeProductTab === 'commercial'
              ? 'bg-primary-900 text-white shadow-sm'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <span>Commercial Wholesale Lots</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">
            {allProducts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveProductTab('order-now')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeProductTab === 'order-now'
              ? 'bg-amber-700 text-white shadow-sm'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Order Now Products (Retail Packages)</span>
        </button>
      </div>

      {activeProductTab === 'order-now' ? (
        <OrderNowProductsTab />
      ) : (
        <>
          {!selectedCategory ? (
            // ── Category List View ──────────────────────────────────
            <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-neutral-900">Commercial Categories</h2>
              <p className="text-neutral-500 text-sm">
                Select a processing category to manage Ethiopian specialty lots
              </p>
            </div>
            <button
              onClick={() => openAddProduct()}
              className="flex items-center gap-2 bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add New Coffee
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const count = allProducts.filter(
                (p) =>
                  p.process?.toLowerCase() === cat.process.toLowerCase() ||
                  p.category?.toLowerCase() === cat.process.toLowerCase()
              ).length;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-brand group transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="relative h-44">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-900/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <p className="text-white font-serif font-bold text-lg">{cat.name}</p>
                        <p className="text-amber-300 font-semibold text-xs mt-0.5">
                          {count} {count === 1 ? 'Product' : 'Products'} Listed
                        </p>
                      </div>
                      <span className="text-xs bg-white/20 backdrop-blur-md text-white font-bold px-2.5 py-1 rounded-full border border-white/30">
                        Manage →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick All-Products table summary below */}
          <div className="mt-10 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-neutral-900 text-lg">Active Catalog ({allProducts.length} Coffees)</h3>
                <p className="text-xs text-neutral-500">Live products syncing with the public coffee catalog</p>
              </div>
              <button
                onClick={() => openAddProduct()}
                className="text-xs font-bold text-primary-700 hover:text-primary-800 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Quick Add
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-100 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Region</th>
                    <th className="pb-3">Process</th>
                    <th className="pb-3">Price / Quintal</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 text-sm">
                  {allProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image || IMAGE_PRESETS[0].url}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = IMAGE_PRESETS[0].url;
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 leading-tight">{p.name}</p>
                          <p className="text-xs text-neutral-400">{p.grade}</p>
                        </div>
                      </td>
                      <td className="py-3 text-neutral-700 font-medium">{p.region}</td>
                      <td className="py-3">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                          {p.process}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-bold text-primary-700">
                        ${p.pricePerQuintal}/Quintal <span className="text-xs text-neutral-400 font-normal">(${(p.pricePerQuintal / 100).toFixed(2)}/kg)</span>
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => openEditProduct(p)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 font-semibold text-xs border border-neutral-300 transition-all shadow-xs mr-2"
                          title="Edit Product"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-neutral-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-semibold text-xs border border-red-200 transition-all shadow-xs"
                          title="Delete Product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        // ── Category Products List ─────────────────────────────
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-neutral-400 hover:text-primary-600 transition-colors p-1"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-xl font-serif font-bold text-neutral-900">{selectedCategory.name}</h2>
                <p className="text-neutral-500 text-sm">
                  {catProducts.length} {catProducts.length === 1 ? 'product' : 'products'} in this category
                </p>
              </div>
            </div>
            <button
              onClick={openAddProduct}
              className="flex items-center gap-2 bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Product & Image
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">
                    Region
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider hidden md:table-cell">
                    Grade
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Price (Quintal / kg)
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider hidden xl:table-cell">
                    Sample Sizes
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {catProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image || IMAGE_PRESETS[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = IMAGE_PRESETS[0].url;
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-neutral-900">{product.name}</span>
                            {product.isTopProduct && (
                              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                ★ Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 line-clamp-1 max-w-xs">{product.profile}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell text-sm text-neutral-700 font-medium">
                      {product.region}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-sm text-neutral-600">{product.grade}</td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-primary-700">${product.pricePerQuintal}/Quintal</div>
                      <div className="text-xs text-neutral-400 font-mono">${(product.pricePerQuintal / 100).toFixed(2)}/kg</div>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell text-xs text-neutral-600">
                      <div className="flex flex-wrap gap-1">
                        {(product.sampleTiers || []).map((t: any) => (
                          <span
                            key={t.id || t.size}
                            className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                              t.isFree || t.price === 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {t.size}: {t.isFree || t.price === 0 ? 'Free' : `$${t.price}`}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                        {product.availability || 'In Stock'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditProduct(product)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 font-semibold text-xs border border-neutral-300 transition-all shadow-xs mr-2"
                        title="Edit product"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-neutral-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-semibold text-xs border border-red-200 transition-all shadow-xs"
                        title="Delete product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {catProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-400 text-sm">
                      No coffees in this category yet. Click &quot;Add Product&quot; to list a new coffee lot.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
        </>
      )}

      {/* ── Product Create / Edit Modal ───────────────────────── */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 animate-fadeIn my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
              <div>
                <h3 className="text-lg font-serif font-bold text-neutral-900">
                  {editingProduct ? 'Edit Coffee Product' : 'Add New Coffee Product'}
                </h3>
                <p className="text-xs text-neutral-500">
                  Provide specifications, live imagery, and sample pricing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* 1. Product Image Section (URL, Upload & Presets) */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-primary-600" />
                    Product Image & Photograph <span className="text-amber-600">*</span>
                  </label>
                  <span className="text-[11px] text-neutral-400">Live on catalog & sample requests</span>
                </div>

                {/* Preview and Controls */}
                <div className="flex gap-4 items-center">
                  <div className="relative h-20 w-24 rounded-xl overflow-hidden border border-neutral-300 bg-neutral-200 flex-shrink-0 shadow-sm flex items-center justify-center">
                    {productForm.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={productForm.image}
                        alt="Product Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = IMAGE_PRESETS[0].url;
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-neutral-400 text-xs font-medium">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      required
                      value={productForm.image}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))}
                      placeholder="Paste image URL (https://...)"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 bg-white border border-neutral-300 hover:border-primary-500 text-neutral-700 hover:text-primary-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                      >
                        <Upload className="h-3.5 w-3.5" /> Upload File
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileUpload}
                      />
                      <span className="text-[11px] text-neutral-400">PNG, JPG, WebP up to 5MB</span>
                    </div>
                  </div>
                </div>

                {/* Preset Suggestions */}
                <div>
                  <p className="text-[11px] font-semibold text-neutral-600 mb-1.5 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" /> Or pick a high-res Ethiopian origin preset:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {IMAGE_PRESETS.map((preset) => {
                      const isSelected = productForm.image === preset.url;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setProductForm((prev) => ({ ...prev, image: preset.url }))}
                          className={`p-1.5 rounded-lg border text-left text-[11px] transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'border-primary-600 bg-primary-50 text-primary-900 font-bold shadow-2xs'
                              : 'border-neutral-200 hover:border-primary-300 bg-white text-neutral-700'
                          }`}
                        >
                          <div className="relative h-6 w-6 rounded flex-shrink-0 overflow-hidden">
                            <Image src={preset.url} alt={preset.label} fill className="object-cover" sizes="24px" />
                          </div>
                          <span className="truncate flex-1">{preset.label}</span>
                          {isSelected && <Check className="h-3 w-3 text-primary-700 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Core Details: Name & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Product Name <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Bale Mountain Natural G1"
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Region <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="region-suggestions"
                    value={productForm.region}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, region: e.target.value }))}
                    placeholder="e.g. Bale, Keffa, Yirgacheffe"
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                  />
                  <datalist id="region-suggestions">
                    {SUGGESTED_REGIONS.map((r) => (
                      <option key={r} value={r} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* 3. Process, Grade, Availability */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Process</label>
                  <select
                    value={productForm.process}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, process: e.target.value }))}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="Washed">Washed</option>
                    <option value="Natural">Natural</option>
                    <option value="Honey">Honey</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Grade</label>
                  <select
                    value={productForm.grade}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, grade: e.target.value }))}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option>Grade 1</option>
                    <option>Grade 2</option>
                    <option>Grade 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Availability</label>
                  <select
                    value={productForm.availability}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, availability: e.target.value }))}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option>In Stock</option>
                    <option>Limited</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* 4. Pricing & Minimum Order (Quintals & kg) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Price per Quintal (100 kg) <span className="text-amber-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={productForm.pricePerQuintal === 0 ? '' : productForm.pricePerQuintal}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          pricePerQuintal: e.target.value === '' ? 0 : Number(e.target.value),
                        }))
                      }
                      placeholder="420"
                      className="w-full border border-neutral-300 rounded-xl pl-8 pr-3 py-2 text-sm text-neutral-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Equivalent to: <strong className="text-primary-700">${((productForm.pricePerQuintal || 0) / 100).toFixed(2)}/kg</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Min Order (Quintals) <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={productForm.minOrderQuintals === 0 ? '' : productForm.minOrderQuintals}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        minOrderQuintals: e.target.value === '' ? 0 : Number(e.target.value),
                      }))
                    }
                    placeholder="10"
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2 text-sm text-neutral-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Equivalent to: <strong className="text-neutral-700">{((productForm.minOrderQuintals || 0) * 100).toLocaleString()} kg</strong>
                  </p>
                </div>
              </div>

              {/* 5. Tasting Notes / Cupping Profile */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Cupping Profile / Flavor Notes
                </label>
                <input
                  type="text"
                  value={productForm.profile}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, profile: e.target.value }))}
                  placeholder="e.g. Jasmine, bergamot, peach sweetness, crisp clean finish"
                  className="w-full border border-neutral-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-800"
                />
              </div>

              {/* 6. Featured Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={productForm.isTopProduct}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, isTopProduct: e.target.checked }))}
                  className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <label htmlFor="featured-toggle" className="text-xs font-semibold text-neutral-700 select-none cursor-pointer">
                  Feature this coffee lot on the homepage &amp; catalog highlights
                </label>
              </div>

              {/* 7. Sample Sizes & Pricing Manager */}
              <div className="pt-3 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-neutral-800">
                    Sample Sizes &amp; Pricing (grams / kg)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSampleTier}
                    className="text-xs font-bold text-primary-700 hover:text-primary-800 inline-flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Size
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400 mb-3">
                  Buyers requesting samples can choose from these configured sizes. Mark Free or assign a fee.
                </p>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {productForm.sampleTiers.map((tier, idx) => (
                    <div
                      key={tier.id || idx}
                      className="flex items-center gap-2 p-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs"
                    >
                      <div className="w-24">
                        <input
                          type="text"
                          value={tier.size}
                          onChange={(e) => handleUpdateSampleTier(idx, 'size', e.target.value)}
                          placeholder="e.g. 250g, 1kg"
                          className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      <label className="flex items-center gap-1.5 cursor-pointer text-neutral-700 select-none pl-1">
                        <input
                          type="checkbox"
                          checked={tier.isFree}
                          onChange={(e) => handleUpdateSampleTier(idx, 'isFree', e.target.checked)}
                          className="rounded text-primary-600 focus:ring-primary-500 h-3.5 w-3.5"
                        />
                        <span className="font-semibold">Free</span>
                      </label>
                      {!tier.isFree ? (
                        <div className="flex-1 flex items-center gap-1">
                          <span className="text-neutral-500 font-bold">$</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={tier.price === 0 ? '' : tier.price}
                            onChange={(e) => handleUpdateSampleTier(idx, 'price', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                            placeholder="Price"
                            className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                      ) : (
                        <span className="flex-1 text-[11px] text-green-700 font-semibold pl-1">
                          Complimentary ($0.00)
                        </span>
                      )}
                      {productForm.sampleTiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSampleTier(idx)}
                          className="text-neutral-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 border border-neutral-200 py-2.5 rounded-full text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-700 text-white py-2.5 rounded-full text-sm font-bold hover:bg-primary-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Save className="h-4 w-4" /> Save &amp; Publish to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
