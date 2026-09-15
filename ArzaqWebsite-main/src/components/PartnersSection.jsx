import React, { useState, useEffect } from 'react';
import { getPartners } from '../services/firebaseService';

const PartnersSection = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      const data = await getPartners();
      setPartners(data);
      setLoading(false);
    };
    fetchPartners();
  }, []);

  // No fallback placeholders - show only real partners
  const displayPartners = partners;

  // If we have very few partners, duplicate them more times to ensure smooth scrolling
  // Only loop if we have at least one partner
  const loopedPartners = displayPartners.length > 0 && displayPartners.length < 5
    ? [...displayPartners, ...displayPartners, ...displayPartners, ...displayPartners]
    : displayPartners.length > 0
      ? [...displayPartners, ...displayPartners]
      : [];

  return (
    <div className="py-12 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Trusted Partners
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            We collaborate with industry leaders worldwide
          </p>
        </div>

        <div className="mt-10 overflow-hidden">
          {partners.length === 0 && !loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No partners found.</p>
            </div>
          ) : (
            <div className="flex animate-loop-scroll space-x-16">
              {loopedPartners.map((partner, index) => (
                <div key={index} className="flex-shrink-0 w-40 h-20 flex items-center justify-center bg-white rounded-lg shadow-sm p-4 overflow-hidden">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain transition-all duration-300"
                    />
                  ) : (
                    <span className="text-gray-700 font-medium">{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes loop-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-loop-scroll {
          animation: loop-scroll 30s linear infinite;
          display: flex;
          width: max-content;
        }
      `}</style>
    </div>
  );
};

export default PartnersSection;