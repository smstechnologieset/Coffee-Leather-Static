import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/firebaseService';

const ContractSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      // Take first 6 categories
      setCategories(data.slice(0, 6));
      setLoading(false);
    };
    fetchCategories();
  }, []);

  return (
    <div className="py-16 bg-gradient-to-r from-amber-800 to-amber-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Request Your Contract Today
          </h2>
          <p className="mt-4 text-xl max-w-3xl mx-auto">
            Secure your supply chain with our flexible contracting options tailored to your business needs
          </p>
        </div>

        <div className="mt-12">
          {loading ? (
            <div className="text-center py-12">Loading options...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105 h-full">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4 overflow-hidden relative">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 text-xl font-bold uppercase">
                          {category.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-center">{category.name}</h3>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="col-span-full text-center text-amber-100">
                  No categories found.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <Link to="/contact" className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-amber-700 bg-yellow-400 hover:bg-yellow-500 transition duration-300 transform hover:scale-105">
            Request a Contract Now
          </Link>
          <p className="mt-4 text-amber-100 max-w-2xl mx-auto">
            Our contract specialists are ready to help you secure the best deals for your business needs
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractSection;