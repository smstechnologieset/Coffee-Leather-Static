import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const videos = [
    "/assets/CoffeeVideo.mp4",
    "/assets/heroVideo2.mp4",
    "/assets/heroVideo.mp4"
  ];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  return (
    <div className="pt-16 text-white relative min-h-screen bg-gray-900">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          src={videos[currentVideoIndex]}
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-5 pt-60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center pb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Global Trade Solutions for <span className="text-yellow-400">Your Needs</span>
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-10">
              ARZAQ Trading PLC connects markets worldwide with premium quality products.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/products" className="inline-block border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-3 rounded-full font-bold transition-all duration-300">
                Explore Products
              </Link>
              <Link to="/contact" className="inline-block border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-amber-900 px-8 py-3 rounded-full font-bold transition-all duration-300">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;