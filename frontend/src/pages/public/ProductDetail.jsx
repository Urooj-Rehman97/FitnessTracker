// frontend/src/pages/public/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cart state
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("fitx_cart")) || []);
  const [showCart, setShowCart] = useState(false);

  // Fetch product
  useEffect(() => {
    fetch("http://localhost:5000/api/products/public")
      .then((res) => res.json())
      .then((data) => {
        const found = data.products?.find((p) => p._id === id);
        setProduct(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Add to cart
  const addToCart = () => {
    const index = cart.findIndex((item) => item._id === product._id);
    let newCart = [...cart];

    if (index > -1) {
      newCart[index].quantity += 1;
    } else {
      newCart.push({ ...product, quantity: 1 });
    }

    setCart(newCart);
    localStorage.setItem("fitx_cart", JSON.stringify(newCart));
    setShowCart(true);
  };

  // Right-click opens cart
  const handleCartRightClick = (e) => {
    e.preventDefault();
    setShowCart(true);
  };

  // Cart actions
  const increaseQty = (id) => {
    const newCart = cart.map((item) => (item._id === id ? { ...item, quantity: item.quantity + 1 } : item));
    setCart(newCart);
    localStorage.setItem("fitx_cart", JSON.stringify(newCart));
  };

  const decreaseQty = (id) => {
    const newCart = cart
      .map((item) => (item._id === id ? { ...item, quantity: item.quantity - 1 } : item))
      .filter((item) => item.quantity > 0);
    setCart(newCart);
    localStorage.setItem("fitx_cart", JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    const newCart = cart.filter((item) => item._id !== id);
    setCart(newCart);
    localStorage.setItem("fitx_cart", JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("fitx_cart", JSON.stringify([]));
  };

  // Stripe checkout
  const handleBuyNow = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: [
            {
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Backend error");

      if (data.url) window.location.href = data.url;
      else alert("Payment URL generation failed. Check backend Stripe key.");
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!product) return <div className="pt-40 text-center text-white">Product not found.</div>;

  return (
    <div className="min-h-screen bg-background-main text-text-primary overflow-x-hidden relative">
      {/* Product Section */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Product Image */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <div className="absolute -inset-10 bg-brand-primary/10 blur-[100px] rounded-full"></div>
          <div className="relative bg-white rounded-[3rem] p-12 shadow-2xl flex items-center justify-center group overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[500px] w-auto object-contain transform group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        </motion.div>

        {/* Product Info */}
        <div className="flex flex-col">
          <span className="text-brand-primary font-bold tracking-[0.3em] mb-4 uppercase text-sm">
            Premium Fitness Gear
          </span>

          <h1 className="text-6xl font-black mb-6 uppercase tracking-tighter leading-tight italic drop-shadow-md">
            {product.name}
          </h1>

          <p className="text-xl text-text-muted mb-10 leading-relaxed max-w-xl font-medium">{product.description}</p>

          <div className="flex items-baseline gap-4 mb-10">
            <span className="text-5xl font-black text-white italic tracking-tighter">
              Rs {product.price.toLocaleString()}
            </span>
            <span className="text-text-muted line-through text-xl font-bold opacity-50">
              Rs {(product.price * 1.2).toFixed(0)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <button
              onClick={handleBuyNow}
              className="flex-[2] bg-brand-primary hover:bg-red-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-[0_10px_40px_rgba(255,0,0,0.2)] active:scale-95"
            >
              Buy Now
            </button>
            <button
              onClick={addToCart}
              onContextMenu={handleCartRightClick}
              className="flex-1 border-2 border-border-card hover:bg-white hover:text-black text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95"
            >
              + Cart
            </button>
          </div>
        </div>
      </main>

      {/* Gear List / Cart Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: showCart ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 w-80 h-full bg-background-main shadow-2xl z-50 flex flex-col p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Your Gear List</h2>
          <button onClick={() => setShowCart(false)} className="text-xl font-bold">×</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 && <p className="text-text-muted">Your cart is empty.</p>}
          {cart.map((item) => (
            <div key={item._id} className="flex items-center gap-3 bg-surface-card p-3 rounded-xl">
              <img src={item.image} className="w-16 h-16 object-contain rounded-lg" />
              <div className="flex-1 flex flex-col">
                <span className="font-bold">{item.name}</span>
                <span className="text-sm text-text-muted">Rs {item.price}</span>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => decreaseQty(item._id)} className="bg-gray-700 px-2 rounded">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item._id)} className="bg-gray-700 px-2 rounded">+</button>
                </div>
              </div>
              <button onClick={() => removeItem(item._id)} className="text-red-600 font-bold">×</button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <>
            <button
              onClick={clearCart}
              className="mt-4 w-full py-3 text-sm text-text-muted hover:text-red-600 transition"
            >
              Clear All
            </button>
            <button
              onClick={() => alert("Proceed to checkout")}
              className="mt-2 w-full bg-brand-primary text-white py-3 rounded-2xl font-bold"
            >
              Checkout <ArrowRight className="inline-block w-5 h-5 ml-2" />
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ProductDetail;
