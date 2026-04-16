const express = require("express");
const router = express.Router();
const stripe = require("stripe")("YOUR_STRIPE_SECRET_KEY"); // Yahan Secret Key dalein

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { products } = req.body;

    // Stripe checkout session create karein
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((product) => ({
        price_data: {
          currency: "pkr", // Ya "usd" jo aap use kar rahe hain
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: product.price * 100, // Cents/Paisa mein convert karta hai
        },
        quantity: product.quantity || 1,
      })),
      mode: "payment",
      success_url: "http://localhost:3000/success", // Payment ke baad yahan jayega
      cancel_url: "http://localhost:3000/cancel",   // Cancel pe yahan jayega
    });

    // Seedha URL bhejna hai ab redirection ke liye
    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;