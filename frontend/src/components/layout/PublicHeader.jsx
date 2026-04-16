// components/Header.jsx
import React, { useState, useEffect } from "react";
import { Activity, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../../assets/Logos/logo-removebg-preview.png";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed w-full z-50 ${
        scrolled
          ? "bg-surface-card/95 backdrop-blur-md shadow-lg border-b border-border-card"
          : "bg-transparent"
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/* <Activity className="w-8 h-8 text-brand-primary" /> */}
            {/* <span className="text-xl font-bold text-brand-primary">FitTracker</span> */}
            {/* Logo image with proper size */}
            <Link to="/">
              <img
                src={logo}
                alt="logo"
                className="h-16 w-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-text-base">
            {[
              { label: "Features", to: "/features" },
              // { label: "Dashboard", to: "/dashboard" },
              { label: "Store", to: "/purchase-products" },
              { label: "About", to: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="hover:text-brand-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/login">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 12px rgba(248, 67, 67, 0.15)",
                }}
                className="bg-brand-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-secondary transition-colors cursor-pointer"
              >
                Get Started
              </motion.button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-text-base"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-surface-card border-t border-border-card"
          >
            <div className="px-4 py-6 space-y-4 text-text-base">
              {[
                { label: "Features", to: "/features" },
               { label: "Store", to: "/purchase-products" },
                { label: "About", to: "/about" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="block hover:text-brand-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full bg-brand-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-secondary transition-colors"
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Header;
