// src/pages/public/Features.jsx
import React, { useRef } from "react";
import {
  Activity,
  Dumbbell,
  LineChart,
  Target,
  Calendar,
  TrendingUp,
  Zap,
  BarChart3,
  Heart,
  Bell,
  FileText,
  Lock,
  Smartphone,
  Cloud,
  Award,
  Users,
} from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const Features = () => {
  // Spotlight Card Component
  const SpotlightCard = ({ children }) => {
    const ref = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const background = useTransform(
      [mouseX, mouseY],
      ([x, y]) =>
        `radial-gradient(400px circle at ${x}px ${y}px, rgba(248, 67, 67, 0.15), transparent 80%)`
    );

    const handleMouseMove = (e) => {
      const rect = ref.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        style={{ background }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
        className="relative bg-surface-card border border-border-card backdrop-blur-xl rounded-xl p-8 transition-all hover:border-brand-primary hover:shadow-lg"
      >
        {children}
      </motion.div>
    );
  };

  const coreFeatures = [
    {
      icon: <Dumbbell className="w-8 h-8 text-brand-primary" />,
      title: "Smart Workout Logging",
      description:
        "Effortlessly track exercises, sets, reps, and progressive overload. Build custom routines and watch your strength gains compound over time.",
      features: [
        "Custom workout routines",
        "Exercise library with 500+ movements",
        "Progressive overload tracking",
        "Rest timer and interval training",
      ],
    },
    {
      icon: <Activity className="w-8 h-8 text-brand-primary" />,
      title: "Intelligent Nutrition Tracking",
      description:
        "Master your macros with precision tracking and AI-powered meal insights. Understand exactly what fuels your performance.",
      features: [
        "Barcode scanner for instant logging",
        "Custom meal creation",
        "Macro and micronutrient breakdown",
        "AI-powered meal recommendations",
      ],
    },
    {
      icon: <LineChart className="w-8 h-8 text-brand-primary" />,
      title: "Advanced Analytics Dashboard",
      description:
        "Beautiful visualizations reveal patterns in your training. Track body composition, strength curves, and performance metrics that matter.",
      features: [
        "Interactive progress charts",
        "Body measurement tracking",
        "Strength progression analysis",
        "Performance trend insights",
      ],
    },
    {
      icon: <Target className="w-8 h-8 text-brand-primary" />,
      title: "AI-Powered Calorie Report",
      description:
        "Get 7-day AI-powered calorie insights. Track intake, burned calories, and deficits with smart, goal-based recommendations.",
      features: [
        "Weekly AI calorie analysis",
        "Deficit/surplus tracking",
        "Smart goal adjustments",
        "Personalized recommendations",
      ],
    },
    {
      icon: <Calendar className="w-8 h-8 text-brand-primary" />,
      title: "Never Miss a Beat",
      description:
        "Intelligent reminders adapt to your schedule. Stay consistent with personalized workout and nutrition alerts that work for you.",
      features: [
        "Smart workout reminders",
        "Meal time notifications",
        "Hydration tracking alerts",
        "Custom schedule builder",
      ],
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-brand-primary" />,
      title: "Professional Reporting",
      description:
        "Export comprehensive fitness reports in PDF or CSV. Share progress with coaches, trainers, or healthcare providers seamlessly.",
      features: [
        "PDF report generation",
        "CSV data export",
        "Progress summaries",
        "Shareable insights",
      ],
    },
  ];

  const additionalFeatures = [
    {
      icon: <Zap className="w-6 h-6 text-brand-primary" />,
      title: "Lightning Fast Performance",
      description: "Optimized for speed with instant data sync across devices.",
    },
    {
      icon: <Lock className="w-6 h-6 text-brand-primary" />,
      title: "Secure & Private",
      description: "Bank-level encryption keeps your health data safe.",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-brand-primary" />,
      title: "Mobile Optimized",
      description: "Perfect experience on any device, anywhere.",
    },
    {
      icon: <Cloud className="w-6 h-6 text-brand-primary" />,
      title: "Cloud Sync",
      description: "Your data automatically synced across all devices.",
    },
    {
      icon: <Award className="w-6 h-6 text-brand-primary" />,
      title: "Achievement System",
      description: "Earn badges and celebrate milestones.",
    },
    {
      icon: <Users className="w-6 h-6 text-brand-primary" />,
      title: "Community Support",
      description: "Join a thriving community of fitness enthusiasts.",
    },
  ];

  return (
    <div className="bg-surface-background  text-text-base overflow-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Powerful Features for{" "}
            <span className="text-brand-primary">Peak Performance</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-text-muted max-w-3xl mx-auto mb-8"
          >
            Everything you need to transform your fitness journey, backed by
            intelligent analytics and seamless tracking tools.
          </motion.p>
        </div>
      </motion.section>

      {/* Core Features Section */}
      {/* Core Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Core <span className="text-brand-primary">Capabilities</span>
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Comprehensive tools designed to help you track, analyze, and
              optimize every aspect of your fitness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex"
              >
                {/* SpotlightCard stretched to full height */}
                <SpotlightCard>
                  <div className="flex flex-col h-full">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-text-base">
                      {feature.title}
                    </h3>
                    <p className="text-text-muted mb-4 flex-1">
                      {feature.description}
                    </p>
                    <ul className="space-y-2 mt-auto">
                      {feature.features.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-text-muted"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {/* Padding to ensure all lists have same height */}
                      {Array(4 - feature.features.length)
                        .fill("")
                        .map((_, idx) => (
                          <li key={"pad-" + idx} className="h-5" />
                        ))}
                    </ul>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Even More <span className="text-brand-primary">To Love</span>
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Built with care to provide the best fitness tracking experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-surface-card border border-border-card rounded-xl p-6 hover:border-brand-primary transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-primary/10 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-base mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              How It <span className="text-brand-primary">Works</span>
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Get started in minutes and see results in days.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Create Your Profile",
                desc: "Set up your account with personalized goals, preferences, and fitness targets in under 2 minutes.",
              },
              {
                num: "02",
                title: "Track Your Journey",
                desc: "Log workouts, meals, and metrics effortlessly. Our smart interface makes tracking second nature.",
              },
              {
                num: "03",
                title: "Achieve Your Goals",
                desc: "Watch AI-powered insights guide you to success. Celebrate milestones and transform your body.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <SpotlightCard>
                  <div className="text-6xl font-bold text-brand-primary mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-text-base">
                    {step.title}
                  </h3>
                  <p className="text-text-muted">{step.desc}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="py-24 px-6 md:px-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-brand-primary/2 via-brand-secondary/5 to-brand-primary/70 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Get <span className="text-brand-primary">Started?</span>
          </h2>
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
            Join thousands who are already transforming their fitness with
            FitX's powerful features.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-linear-to-r from-brand-primary to-brand-secondary text-black font-bold text-lg rounded-2xl shadow-2xl hover:shadow-brand-primary/50 transition-all"
              >
                Start Free Today
              </motion.button>
            </Link>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-surface-card/80 backdrop-blur-sm border-2 border-border-card text-text-base font-semibold text-lg rounded-2xl hover:border-brand-primary/50 transition-all"
              >
                Learn More
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Features;
