// src/pages/store/PurchaseProduct.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all public products from backend
    fetch("http://localhost:5000/api/products/public?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  return (

      <div className="min-h-screen bg-background-main overflow-x-hidden relative transition-colors duration-500">

        {/* SIDE DECORATION TEXT */}
        <div className="hidden xl:block fixed left-4 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <h2 className="text-9xl font-black text-white/5 uppercase tracking-tighter transform -rotate-90 origin-left">
            FITNESS <span className="text-brand-primary/10">ELITE</span>
          </h2>
        </div>
        <div className="hidden xl:block fixed right-4 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <h2 className="text-9xl font-black text-white/5 uppercase tracking-tighter transform rotate-90 origin-right">
            COMMUNITY
          </h2>
        </div>

        {/* Main Content */}
        <div className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto font-body relative z-10">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl md:text-7xl font-black font-heading mb-4 text-text-primary tracking-tighter"
            >
              THE <span className="text-brand-primary">GEAR</span> STORE
            </motion.h1>
            <div className="w-20 h-1.5 bg-brand-primary mx-auto mb-4 rounded-full"></div>
            <p className="text-text-muted max-w-lg mx-auto uppercase tracking-widest text-sm font-semibold">
              Fuel Your Ambition • Performance Driven
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-brand-primary border-r-transparent"></div>
              <p className="mt-6 text-brand-primary font-bold tracking-widest animate-pulse">
                LOADING STORE...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-surface-card/50 backdrop-blur-sm border-2 border-dashed border-border-card rounded-[2rem]">
              <p className="text-2xl text-text-muted font-heading">The shelves are empty for now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {products.map((p, index) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -12 }}
                  className="group relative bg-surface-card border border-border-card rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500"
                >
                  {/* Clickable Link to Product Detail Page */}
                  <Link to={`/product/${p._id}`}>
                    <div className="relative h-64 w-full bg-[#f8f8f8] p-8 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent group-hover:scale-150 transition-transform duration-700"></div>
                      <img
                        src={p.image || "https://via.placeholder.com/150"}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain relative z-10 transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-500"
                      />
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-black text-text-primary leading-tight group-hover:text-brand-primary transition-colors">
                          {p.name}
                        </h3>
                      </div>

                      <p className="text-sm text-text-muted mb-6 line-clamp-2 italic">
                        "{p.description}"
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em]">
                            Investment
                          </p>
                          <span className="text-2xl font-black text-text-primary group-hover:text-brand-primary transition-colors">
                            Rs {p.price.toLocaleString()}
                          </span>
                        </div>

                        {/* Optional +Cart button (just visual) */}
                        <button
                          onClick={(e) => e.preventDefault()}
                          className="h-12 w-12 bg-text-primary group-hover:bg-brand-primary rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-xl"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    
  );
};

export default PurchaseProduct;
