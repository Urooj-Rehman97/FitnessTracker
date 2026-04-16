import {
  Activity,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
} from "lucide-react";
import logo from "../../assets/Logos/logo-removebg-preview.png";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-background text-text-base relative p-16">
      {/* Decorative Backgrounds */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-30 h-30 bg-brand-primary rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-secondary rounded-full opacity-10 translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 right-1/2 w-40 h-40 bg-brand-tertiary rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Link to="/">
                <img
                  src={logo}
                  alt="logo"
                  className="h-20 w-auto cursor-pointer"
                />
              </Link>
            </div>
            <p className="text-text-muted mb-6">
              Transform your fitness journey with personalized workouts,
              progress tracking, and smart nutrition plans. Your goals, your
              pace.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Quick Links</h4>
            <ul className="space-y-2 text-text-muted">
              <li>
                <a href="/" className="hover:text-brand-primary">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-brand-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-brand-primary">
                  Join FitX
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-brand-primary">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Resources</h4>
            <ul className="space-y-2 text-text-muted">
              <li>
                <a href="/workouts" className="hover:text-brand-primary">
                  Workouts
                </a>
              </li>
              <li>
                <a href="/nutrition" className="hover:text-brand-primary">
                  Nutrition
                </a>
              </li>
              <li>
                <a href="/progress" className="hover:text-brand-primary">
                  Progress Tracker
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Contact</h4>
            <p className="text-text-muted mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-primary" />
              support@FitX.com
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-brand-primary">
                <Facebook size={18} />
              </a>
              <a href="#" className="hover:text-brand-primary">
                <Instagram size={18} />
              </a>
              <a href="#" className="hover:text-brand-primary">
                <Twitter size={18} />
              </a>
              <a href="#" className="hover:text-brand-primary">
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-border-card pt-6 flex flex-col md:flex-row justify-between items-center text-text-muted text-sm">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p>&copy; {currentYear} FitX. All rights reserved.</p>
            <p>
              Made with <span className="text-error">♥</span> for fitness
              enthusiasts.
            </p>
            Developed by Ukasha Khurshid
          </div>
          <div className="flex items-center space-x-2">
            <span>Powered by:</span>
            <span className="px-2 py-1 bg-brand-primary hover:bg-brand-tertiary text-text-base rounded text-xs">
              React
            </span>
            <span className="px-2 py-1 bg-brand-primary hover:bg-brand-tertiary text-text-base rounded text-xs">
              Node.js
            </span>
            <span className="px-2 py-1 bg-brand-primary hover:bg-brand-tertiary text-text-base rounded text-xs">
              MongoDB
            </span>
            <span className="px-2 py-1 bg-brand-primary hover:bg-brand-tertiary text-text-base rounded text-xs">
              Gemini
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
