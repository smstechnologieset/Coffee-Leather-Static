'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Image as ImageIcon,
  Upload,
  Sparkles,
  Check,
  Scale,
  DollarSign,
  Coffee,
  Package,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  OrderNowProduct,
  INITIAL_ORDER_NOW_PRODUCTS,
  getOrderNowProducts,
  saveOrderNowProduct,
  updateOrderNowProduct,
  deleteOrderNowProduct,
} from '@/lib/order-products-data';

const DEFAULT_COFFEE_IMAGE = 'https://images.unsplash.com/photo-1559525839-8f8ec320b985?w=800&q=80';

export default function OrderNowProductsTab() {
  const [products, setProducts] = useState<OrderNowProduct[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<OrderNowProduct | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formOrigin, setFormOrigin] = useState('Sidamo & Yirgacheffe Highlands');
  const [formUnit, setFormUnit] = useState<'kg' | 'g' | 'quintal'>('kg');
  const [formPackageWeight, setFormPackageWeight] = useState<string>('1');
  const [formPrice, setFormPrice] = useState<string>('28');
  const [formImage, setFormImage] = useState<string>('');
  const [formFlavorNotes, setFormFlavorNotes] = useState<string>('Floral Jasmine, Bergamot, Wild Honey');
  const [formInStock, setFormInStock] = useState<boolean>(true);
  const [formFeatured, setFormFeatured] = useState<boolean>(false);

  const loadProducts = () => {
    const list = getOrderNowProducts();
    setProducts(list);
  };

  useEffect(() => {
    loadProducts();
    window.addEventListener('kijij_order_now_products_updated', loadProducts);
    window.addEventListener('storage', loadProducts);
    return () => {
      window.removeEventListener('kijij_order_now_products_updated', loadProducts);
      window.removeEventListener('storage', loadProducts);
    };
  }, []);

  const openAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormTagline('');
    setFormDescription('');
    setFormOrigin('Sidamo & Yirgacheffe Highlands');
    setFormUnit('kg');
    setFormPackageWeight('1');
    setFormPrice('');
    setFormImage('');
    setFormFlavorNotes('Floral Jasmine, Bergamot, Wild Honey');
    setFormInStock(true);
    setFormFeatured(false);
    setShowModal(true);
  };

  const openEdit = (prod: OrderNowProduct) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormTagline(prod.tagline || '');
    setFormDescription(prod.description || '');
    setFormOrigin(prod.origin || 'Sidamo & Yirgacheffe Highlands');
    setFormUnit(prod.unit || 'kg');
    setFormPackageWeight(String(prod.packageWeight ?? 1));
    setFormPrice(String(prod.price ?? 28));
    setFormImage(prod.image || '');
    setFormFlavorNotes(
      prod.flavorNotes?.length ? prod.flavorNotes.join(', ') : 'Floral, Sweet'
    );
    setFormInStock(prod.inStock !== false);
    setFormFeatured(Boolean(prod.featured));
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the Order Now products?`)) return;
    deleteOrderNowProduct(id);
    loadProducts();
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
        setFormImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter a product name (e.g. Special Mixed).');
      return;
    }

    const parsedWeight = parseFloat(formPackageWeight);
    const parsedPrice = parseFloat(formPrice);

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      alert('Please enter a valid package weight greater than 0.');
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      alert('Please enter a valid price (0 or greater).');
      return;
    }

    const parsedFlavors = formFlavorNotes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const productId =
      editingProduct?.id ||
      `onp-${formName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const productPayload: OrderNowProduct = {
      id: productId,
      name: formName.trim(),
      tagline: formTagline.trim(),
      description: formDescription.trim(),
      origin: formOrigin.trim(),
      unit: formUnit,
      packageWeight: parsedWeight,
      packageLabel: `${parsedWeight} ${formUnit}`,
      price: parsedPrice,
      image: formImage.trim(),
      flavorNotes: parsedFlavors.length > 0 ? parsedFlavors : ['Highland Fruit', 'Floral'],
      inStock: formInStock,
      featured: formFeatured,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
    };

    saveOrderNowProduct(productPayload);
    setShowModal(false);
    loadProducts();
  };

  // Unit helper for package label auto-suggestion
  const handleUnitChange = (newUnit: 'kg' | 'g' | 'quintal') => {
    setFormUnit(newUnit);
    if (newUnit === 'g') {
      setFormPackageWeight('500');
    } else {
      setFormPackageWeight('1');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/60 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="h-3 w-3 text-amber-700" />
            Direct Retail Packages
          </div>
          <h2 className="text-xl font-serif font-bold text-neutral-900">
            Order Now Products Management
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5 max-w-xl">
            Configure packaged specialty coffee products (like Special Mixed) sold directly to individuals living abroad. Define units (g, kg, quintal), constant prices, and aroma package packaging.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-amber-900/20 transition shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Order Now Product</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              {/* Image Header */}
              <div className="relative h-44 w-full bg-neutral-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image || DEFAULT_COFFEE_IMAGE}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_COFFEE_IMAGE;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {p.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-amber-500 text-neutral-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                      Featured
                    </span>
                  </div>
                )}

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.inStock
                        ? 'bg-emerald-500 text-white'
                        : 'bg-neutral-600 text-white'
                    }`}
                  >
                    {p.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] text-amber-300 font-medium block">
                    {p.origin}
                  </span>
                  <h3 className="font-serif font-bold text-lg leading-snug">{p.name}</h3>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3 text-xs">
                <p className="text-neutral-600 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-[11px]">
                  <div>
                    <span className="text-neutral-400 block font-medium">Package Size:</span>
                    <strong className="text-neutral-800 font-mono">
                      {p.packageWeight} {p.unit}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block font-medium">Price:</span>
                    <span className="text-amber-800 font-bold font-mono text-xs">
                      ${p.price.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* Flavor Notes */}
                <div className="flex flex-wrap gap-1">
                  {p.flavorNotes.map((fn) => (
                    <span
                      key={fn}
                      className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200/60 px-2 py-0.5 rounded-full"
                    >
                      {fn}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="p-4 pt-2 border-t border-neutral-100 flex items-center justify-between">
              <a
                href={`/order-now/${p.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-primary-700 hover:text-primary-900 flex items-center gap-1"
              >
                <span>Live Checkout</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 font-semibold text-xs border border-neutral-300 transition-all shadow-xs"
                  title="Edit product"
                >
                  <Edit2 className="h-3.5 w-3.5 text-neutral-600" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id, p.name)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-semibold text-xs border border-red-200 transition-all shadow-xs"
                  title="Delete product"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Order Now Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-neutral-50">
              <div>
                <h3 className="font-serif font-bold text-lg text-neutral-900">
                  {editingProduct ? 'Edit Order Now Product' : 'Add Order Now Product'}
                </h3>
                <p className="text-xs text-neutral-500">
                  Configure retail package specs, unit scale (g, kg, quintal), and price
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Product Photo */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-neutral-800 flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-amber-700" />
                    Product Photograph & Packaging Preview *
                  </label>
                  <span className="text-[11px] text-neutral-400">Directly rendered on Order Now page</span>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="relative h-20 w-24 rounded-xl overflow-hidden border border-neutral-300 bg-neutral-200 shrink-0 shadow-sm flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formImage || DEFAULT_COFFEE_IMAGE}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_COFFEE_IMAGE;
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      required
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 bg-white border border-neutral-300 hover:border-amber-600 text-neutral-700 hover:text-amber-800 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-2xs"
                      >
                        <Upload className="h-3 w-3" /> Upload File
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileUpload}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Product Name * (e.g. Special Mixed)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Special Mixed"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Signature Ethiopian Highland Roast — Packaged for Direct Delivery Abroad"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Origin / Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sidamo & Yirgacheffe Highlands"
                    value={formOrigin}
                    onChange={(e) => setFormOrigin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-xs"
                  />
                </div>
              </div>

              {/* Units & Pricing Grid */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-1.5 text-amber-950 font-bold">
                  <Scale className="h-4 w-4 text-amber-700" />
                  <span>Unit Scale, Weight & Fixed Price</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Unit Selector */}
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Measurement Unit *
                    </label>
                    <select
                      value={formUnit}
                      onChange={(e) => handleUnitChange(e.target.value as 'kg' | 'g' | 'quintal')}
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white font-bold text-neutral-800"
                    >
                      <option value="kg">Kilograms (kg)</option>
                      <option value="g">Grams (g)</option>
                      <option value="quintal">Quintal (100 kg)</option>
                    </select>
                  </div>

                  {/* Package Weight */}
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Package Weight ({formUnit}) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0.001"
                      required
                      value={formPackageWeight}
                      onChange={(e) => setFormPackageWeight(e.target.value)}
                      placeholder="1"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 font-mono font-bold"
                    />
                  </div>

                  {/* Fixed Price */}
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Price per Package ($ USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-600 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Flavor Notes */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Flavor Notes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formFlavorNotes}
                    onChange={(e) => setFormFlavorNotes(e.target.value)}
                    placeholder="Floral Jasmine, Wild Honey, Chocolate"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe bean varieties, roast character, and brewing recommendations..."
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-xs"
                  />
                </div>
              </div>

              {/* Checkboxes: In Stock & Featured */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="rounded text-amber-700 focus:ring-amber-600"
                  />
                  <span className="font-semibold text-neutral-800">In Stock for International Orders</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded text-amber-700 focus:ring-amber-600"
                  />
                  <span className="font-semibold text-neutral-800">Featured Flagship Product (Top Banner)</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow transition flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Order Now Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
