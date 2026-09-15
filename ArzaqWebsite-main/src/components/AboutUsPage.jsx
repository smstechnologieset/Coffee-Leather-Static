import React, { useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const AboutUsPage = () => {
  const journeyRef = useRef(null);
  const servicesRef = useRef(null);
  const visionRef = useRef(null);
  const teamRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp');
        }
      });
    }, { threshold: 0.1 });

    if (journeyRef.current) observer.observe(journeyRef.current);
    if (servicesRef.current) observer.observe(servicesRef.current);
    if (visionRef.current) observer.observe(visionRef.current);
    if (teamRef.current) observer.observe(teamRef.current);

    return () => {
      if (journeyRef.current) observer.unobserve(journeyRef.current);
      if (servicesRef.current) observer.unobserve(servicesRef.current);
      if (visionRef.current) observer.unobserve(visionRef.current);
      if (teamRef.current) observer.unobserve(teamRef.current);
    };
  }, []);

  // Team members data
  const teamMembers = [
    {
      name: "Abdurrahman seid",
      role: "CEO",
      image: "https://st4.depositphotos.com/9998432/22597/v/380/depositphotos_225976914-stock-illustration-person-gray-photo-placeholder-man.jpg"
    },
    {
      name: "Mohammed Abdulkadir",
      role: "General Manager",
      image: "https://st3.depositphotos.com/9998432/13335/v/380/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg"
    },
    {
      name: "Ahmed Mohammed",
      role: "Marketing Manager",
      image: "https://st4.depositphotos.com/9998432/23259/v/450/depositphotos_232592146-stock-illustration-person-gray-photo-placeholder-man.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-50 to-secondary">
      <Navbar />
      {/* Floating Images Section */}
      <div className="relative py-20 overflow-hidden pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">About ARZAQ Trading PLC</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our journey, services, and the passionate team behind our success
            </p>
          </div>

          {/* Floating Images */}
          <div className="relative h-96 mb-20">
            <div className="absolute top-0 left-10 w-48 h-48 rounded-2xl overflow-hidden shadow-xl transform rotate-6 animate-float">
              <img src="https://images.pexels.com/photos/7772001/pexels-photo-7772001.jpeg" alt="Global Trade" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-10 right-20 w-56 h-56 rounded-2xl overflow-hidden shadow-xl transform -rotate-3 animate-float-delay-1">
              <img src="https://images.pexels.com/photos/17052767/pexels-photo-17052767.jpeg" alt="International Business" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-10 left-1/4 w-40 h-40 rounded-2xl overflow-hidden shadow-xl transform rotate-3 animate-float-delay-2">
              <img src="https://images.pexels.com/photos/15876599/pexels-photo-15876599.jpeg" alt="Business Meeting" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-1/3 w-52 h-52 rounded-2xl overflow-hidden shadow-xl transform -rotate-6 animate-float-delay-3">
              <img src="https://images.pexels.com/photos/9489091/pexels-photo-9489091.jpeg" alt="Team Collaboration" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-1/3 left-1/3 w-44 h-44 rounded-2xl overflow-hidden shadow-xl transform rotate-12 animate-float-delay-4">
              <img src="https://images.pexels.com/photos/11789292/pexels-photo-11789292.jpeg" alt="Business Strategy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* The Journey Section */}
      <section ref={journeyRef} className="py-20 bg-white opacity-0 translate-y-10 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">The Journey of ARZAQ Trading PLC</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-amber-100 rounded-2xl p-8 shadow-lg">
                <p className="text-lg text-gray-700 mb-6">
                  Founded with a vision to bridge global markets, ARZAQ Trading PLC began its journey as a small trading firm with big ambitions. Our founders recognized the untapped potential of Ethiopian products in international markets and set out to create a company that would serve as a gateway for these premium goods.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Starting with just a handful of coffee exporters as clients, we gradually expanded our portfolio to include a diverse range of products - from oil seeds and wheat to construction equipment and gum arabic. Each step of our growth was marked by a commitment to excellence and a deep understanding of both local suppliers and international buyers.
                </p>
                <p className="text-lg text-gray-700">
                  Today, ARZAQ Trading PLC stands as a trusted partner in international trade, connecting suppliers and buyers across continents. Our journey continues as we explore new markets, forge strategic partnerships, and remain committed to our founding principles of quality, reliability, and ethical business practices.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="w-full h-96 rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg"
                    alt="ARZAQ Trading Journey"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <img
                    src="https://images.pexels.com/photos/8276364/pexels-photo-8276364.jpeg"
                    alt="Office"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section ref={servicesRef} className="py-20 bg-amber-50 opacity-0 translate-y-10 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 transition-transform duration-700 group-hover:rotate-[360deg]">
                <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Export Facilitation</h3>
              <p className="text-gray-600">
                We bring buyers and sellers together, ensuring smooth negotiations and seamless logistics. From documentation to shipping, we handle it all so you can focus on what matters most.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 transition-transform duration-700 group-hover:rotate-[360deg]">
                <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Direct Export</h3>
              <p className="text-gray-600">
                As exporters, we take pride in delivering premium Ethiopian coffees to global markets. Our team ensures every shipment meets the highest standards of quality and freshness.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 transition-transform duration-700 group-hover:rotate-[360deg]">
                <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Support for Farmers and Exporters</h3>
              <p className="text-gray-600">
                We are committed to empowering Ethiopian coffee farmers and new exporters. Through partnerships and collaboration, we help them navigate the complexities of the global market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section ref={visionRef} className="py-20 bg-white opacity-0 translate-y-10 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="w-full h-96 rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/7689745/pexels-photo-7689745.jpeg"
                    alt="Our Vision"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-6 -left-6 w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <img
                    src="https://images.pexels.com/photos/8276364/pexels-photo-8276364.jpeg"
                    alt="Vision"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-gradient-to-r from-amber-700 to-amber-800 rounded-2xl p-8 text-white shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
                <div className="w-24 h-1 bg-yellow-400 mb-8"></div>
                <p className="text-xl leading-relaxed">
                  To be a global leader in Ethiopian coffee exports, known for our quality, sustainability, and commitment to empowering coffee communities.
                </p>
                <div className="mt-8 flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-amber-900">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg">
                    Sustainability at the core of everything we do
                  </p>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400 text-amber-900">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <p className="text-lg">
                    Empowering local communities through fair trade
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section ref={teamRef} className="py-20 bg-amber-50 opacity-0 translate-y-10 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Leadership Team</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
            <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
              Meet the passionate individuals who drive our success and embody our values
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group flex flex-col items-center text-center"
              >
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg mb-6 border-4 border-white group-hover:border-amber-100 transition-colors duration-500">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-amber-700 font-medium mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(3deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay-1 {
          animation: float 6s ease-in-out infinite 0.5s;
        }
        
        .animate-float-delay-2 {
          animation: float 6s ease-in-out infinite 1s;
        }
        
        .animate-float-delay-3 {
          animation: float 6s ease-in-out infinite 1.5s;
        }
        
        .animate-float-delay-4 {
          animation: float 6s ease-in-out infinite 2s;
        }
        
        .animate-fadeInUp {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default AboutUsPage;