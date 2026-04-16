import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  useEffect(() => {
    // Payment ke baad cart khali kar dein
    localStorage.removeItem("fitx_cart");
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#111] border border-green-500/30 p-10 rounded-[2.5rem] text-center"
      >
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Purchase Successful!</h1>
        <p className="text-gray-400 mb-8 font-medium">Your gear is being prepared for shipment. You will receive a confirmation email shortly.</p>
        
        <div className="flex flex-col gap-3">
          <Link 
            to="/dashboard" 
            className="bg-brand-primary hover:bg-red-700 text-white py-4 rounded-xl font-bold uppercase tracking-wider transition-all"
          >
            Go to Dashboard
          </Link>
          <Link 
            to="/purchase-products" 
            className="text-gray-500 hover:text-white text-sm font-bold uppercase tracking-widest transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;