'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, ArrowLeft, X, Save } from 'lucide-react';

const MOCK_CATEGORIES = [
  { id: '1', name: 'Washed Coffees', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80', productCount: 2 },
  { id: '2', name: 'Natural Coffees', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80', productCount: 3 },
  { id: '3', name: 'Honey Process', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', productCount: 1 },
];

const MOCK_PRODUCTS: Record<string, any[]> = {
  '1': [
    { id: 'p1', name: 'Yirgacheffe Grade 1', region: 'Yirgacheffe', grade: 'Grade 1', price: '$4,200/MT', availability: 'In Stock', isTopProduct: true },
    { id: 'p4', name: 'Limu Washed G2', region: 'Limu', grade: 'Grade 2', price: '$3,400/MT', availability: 'Limited', isTopProduct: false },
  ],
  '2': [
    { id: 'p2', name: 'Sidamo Natural G1', region: 'Sidamo', grade: 'Grade 1', price: '$3,800/MT', availability: 'In Stock', isTopProduct: true },
    { id: 'p3', name: 'Harar Longberry Natural', region: 'Harar', grade: 'Grade 1', price: '$4,600/MT', availability: 'In Stock', isTopProduct: false },
    { id: 'p5', name: 'Guji Zone Natural G1', region: 'Guji', grade: 'Grade 1', price: '$4,900/MT', availability: 'In Stock', isTopProduct: true },
  ],
  '3': [
    { id: 'p6', name: 'Jimma Honey Process', region: 'Jimma', grade: 'Grade 2', price: '$4,100/MT', availability: 'In Stock', isTopProduct: false },
  ],
};

export default function ProductsSection() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<typeof MOCK_CATEGORIES[0] | null>(null);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({ name: '', region: '', grade: 'Grade 1', price: '', availability: 'In Stock' });

  const catProducts = selectedCategory ? (products[selectedCategory.id] || []) : [];

  const handleDeleteProduct = (productId: string) => {
    if (!selectedCategory) return;
    if (!confirm('Delete this product?')) return;
    setProducts((prev) => ({
      ...prev,
      [selectedCategory.id]: prev[selectedCategory.id].filter((p) => p.id !== productId),
    }));
  };

  const handleSaveProduct = () => {
    if (!selectedCategory || !productForm.name) return;
    const catId = selectedCategory.id;
    if (editingProduct) {
      setProducts((prev) => ({
        ...prev,
        [catId]: prev[catId].map((p) => p.id === editingProduct.id ? { ...p, ...productForm } : p),
      }));
    } else {
      setProducts((prev) => ({
        ...prev,
        [catId]: [...(prev[catId] || []), { id: `p-${Date.now()}`, ...productForm, isTopProduct: false }],
      }));
    }
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({ name: '', region: '', grade: 'Grade 1', price: '', availability: 'In Stock' });
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', region: '', grade: 'Grade 1', price: '', availability: 'In Stock' });
    setShowProductModal(true);
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({ name: product.name, region: product.region, grade: product.grade, price: product.price, availability: product.availability });
    setShowProductModal(true);
  };

  return (
    <div>
      {!selectedCategory ? (
        // ── Category list ──────────────────────────────────────
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-neutral-900">Product Categories</h2>
              <p className="text-neutral-500 text-sm">Select a category to manage products</p>
            </div>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-primary-800 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-brand group transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="relative h-40">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <p className="text-white font-serif font-bold text-lg">{cat.name}</p>
                    <p className="text-white/70 text-xs">{cat.productCount} products</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-end gap-2">
                  <button onClick={(e) => { e.stopPropagation(); }} className="text-neutral-400 hover:text-primary-600 transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete category?')) setCategories(categories.filter((c) => c.id !== cat.id)); }} className="text-neutral-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // ── Product list for category ──────────────────────────
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedCategory(null)} className="text-neutral-400 hover:text-primary-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-xl font-serif font-bold text-neutral-900">{selectedCategory.name}</h2>
                <p className="text-neutral-500 text-sm">{catProducts.length} products</p>
              </div>
            </div>
            <button
              onClick={openAddProduct}
              className="flex items-center gap-2 bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-primary-800 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">Region</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Grade</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {catProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-neutral-900">{product.name}</span>
                        {product.isTopProduct && (
                          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">★ Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell text-sm text-neutral-600">{product.region}</td>
                    <td className="px-5 py-4 hidden md:table-cell text-sm text-neutral-600">{product.grade}</td>
                    <td className="px-5 py-4 text-sm font-bold text-primary-700">{product.price}</td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${product.availability === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {product.availability}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditProduct(product)} className="text-neutral-400 hover:text-primary-600 transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {catProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-neutral-400 text-sm">No products in this category yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Product modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif font-bold text-lg text-neutral-900">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowProductModal(false)}><X className="h-5 w-5 text-neutral-400" /></button>
            </div>
            <div className="space-y-3">
              {[
                { field: 'name', label: 'Product Name', placeholder: 'e.g. Yirgacheffe Grade 1 Washed' },
                { field: 'region', label: 'Region / Origin', placeholder: 'e.g. Yirgacheffe' },
                { field: 'price', label: 'Price', placeholder: 'e.g. $4,200/MT' },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">{label}</label>
                  <input
                    type="text"
                    value={(productForm as any)[field]}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Grade</label>
                <select value={productForm.grade} onChange={(e) => setProductForm((prev) => ({ ...prev, grade: e.target.value }))}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Grade 1</option>
                  <option>Grade 2</option>
                  <option>Grade 3</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Availability</label>
                <select value={productForm.availability} onChange={(e) => setProductForm((prev) => ({ ...prev, availability: e.target.value }))}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>In Stock</option>
                  <option>Limited</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowProductModal(false)} className="flex-1 border border-neutral-200 py-2.5 rounded-full text-sm font-medium text-neutral-600 hover:bg-neutral-50">Cancel</button>
              <button onClick={handleSaveProduct} className="flex-1 bg-primary-700 text-white py-2.5 rounded-full text-sm font-bold hover:bg-primary-800 transition-colors flex items-center justify-center gap-2">
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
