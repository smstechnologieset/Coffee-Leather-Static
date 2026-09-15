import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTopProducts } from '../services/firebaseService';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      const data = await getTopProducts(3);
      setProducts(data);
      setLoading(false);
    };
    fetchTopProducts();
  }, []);

  const checkStockStatus = (product) => {
    // Helper to find value by case-insensitive key
    const getValue = (obj, targetKey) => {
      if (!obj) return undefined;
      const key = Object.keys(obj).find(k => k.toLowerCase().trim() === targetKey.toLowerCase());
      return key ? obj[key] : undefined;
    };

    // 1. Try to find 'availability' in root or attributes
    const availRoot = getValue(product, 'availability');
    const availAttr = getValue(product.attributes, 'availability');

    // Prioritize attributes, then root
    const availability = availAttr !== undefined ? availAttr : availRoot;

    // 2. Determine status based on value
    if (availability !== undefined && availability !== null && availability !== '') {
      const val = String(availability).trim().toLowerCase();
      // User Logic: "values are either 'In stock' or 'Out of stock'"
      // We check for "in stock" truthiness
      return val === 'in stock' || val === 'yes' || val === 'true';
    }

    // 3. Fallback to 'inStock' legacy field if Availability is completely missing
    // Checking case-insensitive 'instock' just in case
    const inStock = getValue(product, 'instock') || getValue(product.attributes, 'instock') || product.inStock;
    if (inStock !== undefined && inStock !== null) {
      if (typeof inStock === 'string') {
        return inStock.toLowerCase() === 'true';
      }
      return inStock === true;
    }

    // Default to Out of Stock if nothing confirms otherwise
    return false;
  };

  const getStatusColor = (product) => {
    return checkStockStatus(product) ? 'bg-green-100 text-green-800' : 'bg-red-600 text-white';
  };

  const getStockText = (product) => {
    return checkStockStatus(product) ? 'In Stock' : 'Out of Stock';
  };

  const formatPrice = (price) => {
    if (!price) return 'Contact for Price';
    const priceString = String(price);
    return priceString.trim().startsWith('$') ? priceString : `$${priceString}`;
  };

  // Helper to get Owner attribute
  const getOwner = (product) => {
    return product.owner || product.Owner || product.attributes?.owner || product.attributes?.Owner;
  };

  const getTypeColor = (natural) => {
    return natural ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Premium Products
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Quality products sourced from trusted suppliers worldwide
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-amber-50 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={
                    product.image ||
                    product.Image ||
                    product.imageUrl ||
                    product.img ||
                    (product.attributes && (product.attributes.image || product.attributes.Image || product.attributes.imageUrl)) ||
                    '/assets/coffee.jpg'
                  }
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = '/assets/coffee.jpg' }} // Fallback image
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors duration-300">
                  {product.name || product.Name || (product.attributes && (product.attributes.name || product.attributes.Name)) || 'Unnamed Product'}
                </h3>
                <div className="flex justify-between items-start mt-2">
                  <p className="text-lg font-semibold text-amber-700">
                    {formatPrice(product.price || product.Price || (product.attributes && (product.attributes.price || product.attributes.Price)))}
                  </p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusColor(product)}`}>
                    {getStockText(product)}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {/* Render dynamic attributes if available, else standard badges */}
                  {product.natural !== undefined && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(product.natural)}`}>
                      {product.natural ? 'Natural' : 'Processed'}
                    </span>
                  )}
                </div>
                {getOwner(product) && (
                  <p className="mt-4 text-sm text-gray-600">
                    <span className="font-medium">Supplier:</span> {getOwner(product)}
                  </p>
                )}
                {product.minOrder && (
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Min. Order:</span> {product.minOrder}
                  </p>
                )}

                <div className="mt-6 flex flex-col space-y-3">
                  <Link to={`/request-sample/${product.id}`} className="w-full inline-block border-2 border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white px-6 py-2 rounded-full font-bold transition-all duration-300 text-center text-sm">
                    Request Sample
                  </Link>
                  <Link to={`/request-contract/${product.id}`} className="w-full inline-block border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white px-6 py-2 rounded-full font-bold transition-all duration-300 text-center text-sm">
                    Request Contract
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {/* Fallback if no products */}
          {!loading && products.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              <p className="text-lg">No Premium Products currently featured.</p>
              <p className="text-sm mt-2">Check back soon for our featured selection.</p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link to="/products" className="inline-block border-2 border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white px-8 py-3 rounded-full font-bold transition-all duration-300">
            Explore More Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
