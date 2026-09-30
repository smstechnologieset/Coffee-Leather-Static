'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus, Pencil, Trash2, Search, X, Check, Star,
  ChevronDown, ChevronUp, Eye, EyeOff,
} from 'lucide-react';
import {
  getLeatherProducts, saveLeatherProduct, deleteLeatherProduct,
  LeatherProduct, LeatherCategory, LeatherColor,
} from '@/lib/leather-data';

const CATEGORIES: LeatherCategory[] = [
  'Bags', 'Jackets', 'Small Leather Goods', 'Wallets', 'Belts & Accessories',
];

const EMPTY_PRODUCT: Omit<LeatherProduct, 'id' | 'createdAt'> = {
  slug: '',
  name: '',
  tagline: '',
  category: 'Bags',
  subCategory: '',
  price: 0,
  originalPrice: undefined,
  description: '',
  craftingNote: '',
  features: [''],
  material: '',
  origin: '',
  careInstructions: '',
  images: [''],
  colors: [{ name: '', hex: '#8B4513' }],
  sizes: [],
  weight: '',
  dimensions: '',
  inStock: true,
  stockCount: undefined,
  isNew: false,
  isBestseller: false,
  isFeatured: false,
  isOnSale: false,
  tags: [],
  rating: undefined,
  reviewCount: undefined,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Modal field helpers
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent';
const toggleCls = (on: boolean) =>
  `relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors ${on ? 'bg-neutral-900' : 'bg-neutral-200'}`;

export default function ProductsTab() {
  const [products, setProducts] = useState<LeatherProduct[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<LeatherCategory | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LeatherProduct | null>(null);
  const [form, setForm] = useState<Omit<LeatherProduct, 'id' | 'createdAt'>>(EMPTY_PRODUCT);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProducts(getLeatherProducts());
    const h = () => setProducts(getLeatherProducts());
    window.addEventListener('kijij_leather_products_updated', h);
    return () => window.removeEventListener('kijij_leather_products_updated', h);
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const openNew = () => {
    setEditingProduct(null);
    setForm({ ...EMPTY_PRODUCT });
    setShowModal(true);
  };

  const openEdit = (p: LeatherProduct) => {
    setEditingProduct(p);
    setForm({
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      category: p.category,
      subCategory: p.subCategory ?? '',
      price: p.price,
      originalPrice: p.originalPrice,
      description: p.description,
      craftingNote: p.craftingNote ?? '',
      features: p.features.length ? p.features : [''],
      material: p.material,
      origin: p.origin ?? '',
      careInstructions: p.careInstructions ?? '',
      images: p.images.length ? p.images : [''],
      colors: p.colors.length ? p.colors : [{ name: '', hex: '#8B4513' }],
      sizes: p.sizes ?? [],
      weight: p.weight ?? '',
      dimensions: p.dimensions ?? '',
      inStock: p.inStock,
      stockCount: p.stockCount,
      isNew: p.isNew ?? false,
      isBestseller: p.isBestseller ?? false,
      isFeatured: p.isFeatured ?? false,
      isOnSale: p.isOnSale ?? false,
      tags: p.tags ?? [],
      rating: p.rating,
      reviewCount: p.reviewCount,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const id = editingProduct?.id ?? `lp-${Date.now()}`;
    const slug = form.slug || slugify(form.name);
    const product: LeatherProduct = {
      ...form,
      id,
      slug,
      createdAt: editingProduct?.createdAt ?? new Date().toISOString(),
      features: form.features.filter((f) => f.trim()),
      images: form.images.filter((i) => i.trim()),
      colors: form.colors.filter((c) => c.name.trim()),
      sizes: (form.sizes ?? []).filter((s) => s.trim()),
    };
    saveLeatherProduct(product);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowModal(false);
    }, 800);
  };

  const handleDelete = (id: string) => {
    deleteLeatherProduct(id);
    setDeleteConfirm(null);
  };

  const setFormField = <K extends keyof typeof form>(key: K, val: typeof form[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const updateColor = (i: number, field: keyof LeatherColor, val: string) => {
    const colors = [...form.colors];
    colors[i] = { ...colors[i], [field]: val };
    setFormField('colors', colors);
  };

  const updateFeature = (i: number, val: string) => {
    const features = [...form.features];
    features[i] = val;
    setFormField('features', features);
  };

  const updateImage = (i: number, val: string) => {
    const images = [...form.images];
    images[i] = val;
    setFormField('images', images);
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value as LeatherCategory | 'All')}
            className="text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Products table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Badges', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50 transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#F2EDE8] flex-shrink-0">
                        {p.images[0] && (
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" unoptimized />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 text-xs">{p.name}</p>
                        <p className="text-[10px] text-neutral-400">{p.tagline}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-neutral-600 whitespace-nowrap">{p.category}</td>
                  <td className="px-5 py-3 text-xs font-bold text-neutral-900">
                    ${p.price.toFixed(2)}
                    {p.originalPrice && (
                      <span className="ml-1 font-normal text-neutral-400 line-through text-[10px]">
                        ${p.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${p.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {p.inStock ? <Eye className="h-2.5 w-2.5" /> : <EyeOff className="h-2.5 w-2.5" />}
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {p.stockCount !== undefined && (
                        <span className={`text-[10px] ${p.stockCount <= 5 ? 'text-amber-600 font-bold' : 'text-neutral-400'}`}>
                          ({p.stockCount})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.isNew && <span className="text-[9px] font-bold uppercase bg-neutral-900 text-white px-1.5 py-0.5">New</span>}
                      {p.isBestseller && <span className="text-[9px] font-bold uppercase bg-[#7A4F2E] text-white px-1.5 py-0.5">Best</span>}
                      {p.isFeatured && <span className="text-[9px] font-bold uppercase bg-violet-600 text-white px-1.5 py-0.5">Featured</span>}
                      {p.isOnSale && <span className="text-[9px] font-bold uppercase bg-red-600 text-white px-1.5 py-0.5">Sale</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-neutral-400 text-sm">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-neutral-900 mb-2">Delete product?</h3>
            <p className="text-sm text-neutral-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-medium py-2 rounded-lg hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40">
          <div className="w-full max-w-2xl h-full bg-white overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-neutral-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-5 w-5 text-neutral-400 hover:text-neutral-900" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 px-6 py-5 space-y-5">

              {/* Basic info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Field label="Product Name *">
                    <input
                      value={form.name}
                      onChange={(e) => {
                        setFormField('name', e.target.value);
                        if (!editingProduct) setFormField('slug', slugify(e.target.value));
                      }}
                      className={inputCls}
                      placeholder="e.g. Highland Weekender Duffle"
                    />
                  </Field>
                </div>
                <Field label="Tagline *">
                  <input
                    value={form.tagline}
                    onChange={(e) => setFormField('tagline', e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Full-grain Ethiopian cowhide"
                  />
                </Field>
                <Field label="URL Slug">
                  <input
                    value={form.slug}
                    onChange={(e) => setFormField('slug', e.target.value)}
                    className={inputCls}
                    placeholder="auto-generated from name"
                  />
                </Field>
                <Field label="Category *">
                  <select
                    value={form.category}
                    onChange={(e) => setFormField('category', e.target.value as LeatherCategory)}
                    className={inputCls}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Sub-category">
                  <input
                    value={form.subCategory ?? ''}
                    onChange={(e) => setFormField('subCategory', e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Tote, Biker Jacket"
                  />
                </Field>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (USD) *">
                  <input
                    type="number"
                    step="any"
                    value={form.price === 0 ? '' : form.price}
                    onChange={(e) => setFormField('price', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    className={inputCls}
                    placeholder="0.00"
                  />
                </Field>
                <Field label="Original Price (if on sale)">
                  <input
                    type="number"
                    step="any"
                    value={form.originalPrice ?? ''}
                    onChange={(e) => setFormField('originalPrice', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                    className={inputCls}
                    placeholder="Leave blank if not on sale"
                  />
                </Field>
              </div>

              {/* Description */}
              <Field label="Description *">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setFormField('description', e.target.value)}
                  className={inputCls + ' resize-none'}
                  placeholder="Write a rich, detailed product description..."
                />
              </Field>

              <Field label="Crafting Note">
                <textarea
                  rows={2}
                  value={form.craftingNote ?? ''}
                  onChange={(e) => setFormField('craftingNote', e.target.value)}
                  className={inputCls + ' resize-none'}
                  placeholder="e.g. Hand-stitched at our Addis Ababa atelier over 22 hours..."
                />
              </Field>

              <Field label="Care Instructions">
                <textarea
                  rows={2}
                  value={form.careInstructions ?? ''}
                  onChange={(e) => setFormField('careInstructions', e.target.value)}
                  className={inputCls + ' resize-none'}
                  placeholder="e.g. Condition every 3-6 months with beeswax cream..."
                />
              </Field>

              {/* Features */}
              <Field label="Features">
                <div className="space-y-2">
                  {form.features.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={f}
                        onChange={(e) => updateFeature(i, e.target.value)}
                        className={inputCls}
                        placeholder={`Feature ${i + 1}`}
                      />
                      <button
                        onClick={() => setFormField('features', form.features.filter((_, j) => j !== i))}
                        className="p-2 text-neutral-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setFormField('features', [...form.features, ''])}
                    className="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2"
                  >
                    + Add feature
                  </button>
                </div>
              </Field>

              {/* Material / Origin */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Material">
                  <input
                    value={form.material}
                    onChange={(e) => setFormField('material', e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Full-grain Ethiopian cowhide"
                  />
                </Field>
                <Field label="Origin / Tannery">
                  <input
                    value={form.origin ?? ''}
                    onChange={(e) => setFormField('origin', e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Mojo Leather Tannery"
                  />
                </Field>
                <Field label="Weight">
                  <input
                    value={form.weight ?? ''}
                    onChange={(e) => setFormField('weight', e.target.value)}
                    className={inputCls}
                    placeholder="e.g. 1.4 kg"
                  />
                </Field>
                <Field label="Dimensions">
                  <input
                    value={form.dimensions ?? ''}
                    onChange={(e) => setFormField('dimensions', e.target.value)}
                    className={inputCls}
                    placeholder="e.g. 48cm x 32cm x 22cm"
                  />
                </Field>
              </div>

              {/* Images */}
              <Field label="Images (URLs)">
                <div className="space-y-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={img}
                        onChange={(e) => updateImage(i, e.target.value)}
                        className={inputCls}
                        placeholder="https://..."
                      />
                      {img && (
                        <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-[#F2EDE8]">
                          <Image src={img} alt="" fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <button
                        onClick={() => setFormField('images', form.images.filter((_, j) => j !== i))}
                        className="p-2 text-neutral-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setFormField('images', [...form.images, ''])}
                    className="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2"
                  >
                    + Add image URL
                  </button>
                </div>
              </Field>

              {/* Colours */}
              <Field label="Colours">
                <div className="space-y-2">
                  {form.colors.map((c, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={c.hex}
                        onChange={(e) => updateColor(i, 'hex', e.target.value)}
                        className="h-9 w-9 rounded border border-neutral-200 cursor-pointer flex-shrink-0"
                      />
                      <input
                        value={c.name}
                        onChange={(e) => updateColor(i, 'name', e.target.value)}
                        className={inputCls}
                        placeholder="Colour name (e.g. Cognac)"
                      />
                      <button
                        onClick={() => setFormField('colors', form.colors.filter((_, j) => j !== i))}
                        className="p-2 text-neutral-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setFormField('colors', [...form.colors, { name: '', hex: '#8B4513' }])}
                    className="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2"
                  >
                    + Add colour
                  </button>
                </div>
              </Field>

              {/* Sizes */}
              <Field label="Sizes (comma separated, or leave blank)">
                <input
                  value={(form.sizes ?? []).join(', ')}
                  onChange={(e) =>
                    setFormField(
                      'sizes',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  className={inputCls}
                  placeholder="e.g. XS, S, M, L, XL or 30&quot;, 32&quot;, 34&quot;"
                />
              </Field>

              {/* Stock */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Stock Count">
                  <input
                    type="number"
                    min={0}
                    value={form.stockCount ?? ''}
                    onChange={(e) => setFormField('stockCount', e.target.value === '' ? undefined : parseInt(e.target.value))}
                    className={inputCls}
                    placeholder="Leave blank if not tracking"
                  />
                </Field>
                <Field label="Rating (1.0 – 5.0)">
                  <input
                    type="number"
                    step="0.1"
                    min={1}
                    max={5}
                    value={form.rating ?? ''}
                    onChange={(e) => setFormField('rating', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                    className={inputCls}
                    placeholder="e.g. 4.8"
                  />
                </Field>
              </div>

              {/* Toggles */}
              <Field label="Flags &amp; Badges">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {([
                    ['In Stock', 'inStock'],
                    ['New In', 'isNew'],
                    ['Bestseller', 'isBestseller'],
                    ['Featured', 'isFeatured'],
                    ['On Sale', 'isOnSale'],
                  ] as [string, keyof typeof form][]).map(([label, key]) => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={!!form[key]}
                        onClick={() => setFormField(key, !form[key] as typeof form[typeof key])}
                        className={toggleCls(!!form[key])}
                      >
                        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${form[key] ? 'left-4' : 'left-0.5'}`} />
                      </button>
                      <span className="text-sm text-neutral-700">{label}</span>
                    </label>
                  ))}
                </div>
              </Field>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-neutral-100 sticky bottom-0 bg-white flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`flex-1 text-sm font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  saved ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-white hover:bg-neutral-700'
                }`}
              >
                {saved ? <><Check className="h-4 w-4" /> Saved!</> : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
