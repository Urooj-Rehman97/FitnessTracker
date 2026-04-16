// src/pages/public/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import dashImg from "../../assets/User-Dashboad-Light.PNG";
import {
  Activity,
  Dumbbell,
  LineChart,
  Users,
  ChevronRight,
  Target,
  Calendar,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const features = [
    {
      icon: <Dumbbell className="w-8 h-8 text-brand-primary" />,
      title: "Smart Workout Logging",
      description:
        "Effortlessly track exercises, sets, reps, and progressive overload. Build custom routines and watch your strength gains compound over time.",
    },
    {
      icon: <Activity className="w-8 h-8 text-brand-primary" />,
      title: "Intelligent Nutrition Tracking",
      description:
        "Master your macros with precision tracking and AI-powered meal insights. Understand exactly what fuels your performance.",
    },
    {
      icon: <LineChart className="w-8 h-8 text-brand-primary" />,
      title: "Advanced Analytics Dashboard",
      description:
        "Beautiful visualizations reveal patterns in your training. Track body composition, strength curves, and performance metrics that matter.",
    },
    {
      icon: <Target className="w-8 h-8 text-brand-primary" />,
      title: "AI-Powered Calorie Report",
      description:
        "Get 7-day AI-powered calorie insights. Track intake, burned calories, and deficits with smart, goal-based recommendations.",
    },
    {
      icon: <Calendar className="w-8 h-8 text-brand-primary" />,
      title: "Never Miss a Beat",
      description:
        "Intelligent reminders adapt to your schedule. Stay consistent with personalized workout and nutrition alerts that work for you.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-brand-primary" />,
      title: "Professional Reporting",
      description:
        "Export comprehensive fitness reports in PDF or CSV. Share progress with coaches, trainers, or healthcare providers seamlessly.",
    },
  ];

  return (
    <div className="bg-surface-background min-h-screen text-text-base overflow-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Your Fitness Journey,{" "}
              <span className="block text-brand-primary">Powered by Data</span>
            </h1>
            <p className="text-xl text-text-muted">
              Transform your health with intelligent tracking, personalized
              insights, and real-time analytics. Your complete fitness command
              center.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 12px rgba(251,191,36,0.6)",
                  }}
                  className="bg-brand-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-brand-secondary transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <span>Start Free Today</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/demo">
                <button className="border-2 border-brand-primary text-brand-primary px-8 py-4 rounded-lg font-semibold hover:bg-brand-primary hover:text-white transition-colors w-full sm:w-auto">
                  Watch Demo
                </button>
              </Link>
            </div>
          </div>

          <SpotlightCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-text-muted">
                <span>Dashboard Preview</span>
                <Users className="w-5 h-5 text-brand-primary" />
              </div>
              <div className="bg-surface-card-alt h-fit rounded-lg overflow-hidden border border-border-card">
                <img
                  src={dashImg}
                  alt="Dashboard"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </SpotlightCard>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Powerful <span className="text-brand-primary">Features</span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Everything you need to track, analyze, and optimize your fitness
            journey with precision.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <SpotlightCard>
                <div className="flex flex-col h-full min-h-[200px]">
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-text-base">
                    {f.title}
                  </h3>
                  <p className="text-text-muted grow">{f.description}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <motion.section
        id="dashboard"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-card/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Your Command <span className="text-brand-primary">Center</span>
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Everything you need, organized beautifully. Access your complete
              fitness ecosystem from anywhere.
            </p>
          </div>
          <SpotlightCard>
            <div className="grid md:grid-cols-2 gap-6">
              {[Activity, LineChart, TrendingUp].map((Icon, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-surface-card rounded-lg p-6 border border-border-card ${idx === 2 ? "md:col-span-2 h-48" : "h-64"
                    } flex items-center justify-center`}
                >
                  <div className="text-center space-y-3 ">
                    <Icon className="w-16 h-16 text-brand-primary mx-auto " />
                    <div className="text-lg font-semibold text-text-base ">
                      {idx === 0
                        ? "Workout Intelligence"
                        : idx === 1
                          ? "Nutrition Insights"
                          : "Progress Timeline"}
                    </div>
                    <div className="text-sm text-text-muted">
                      {idx === 0
                        ? "Real-time analytics and performance tracking"
                        : idx === 1
                          ? "Smart macro tracking and meal planning"
                          : "Visualize your transformation journey"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Built for{" "}
              <span className="text-brand-primary">Peak Performance</span>
            </h2>
            <div className="space-y-4 text-text-muted">
              <p>
                FitX empowers you to take complete control of your fitness
                journey with intelligent tracking tools and actionable insights.
              </p>
              <p>
                Our advanced analytics and personalized dashboards help you
                identify patterns, optimize training, and accelerate toward your
                goals with confidence.
              </p>
              <p>
                Join thousands of athletes, fitness enthusiasts, and
                health-conscious individuals transforming their lives through
                data-driven fitness.
              </p>
            </div>
            <button className="mt-8 bg-brand-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-brand-secondary transition-colors">
              Discover More
            </button>
          </div>
          <SpotlightCard>
            <div className="space-y-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center space-x-4">
                  <div className="bg-brand-primary text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold">
                    {n}
                  </div>
                  <div>
                    <div className="font-semibold text-text-base">
                      {n === 1
                        ? "Create Your Profile"
                        : n === 2
                          ? "Log Your Activities"
                          : "Achieve Your Goals"}
                    </div>
                    <div className="text-sm text-text-muted">
                      {n === 1
                        ? "Personalize your dashboard and set targets"
                        : n === 2
                          ? "Track workouts, meals, and progress daily"
                          : "Watch your data transform into results"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      </motion.section>

      {/* CTA Section - Fully Themed & Premium */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="py-24 px-6 md:px-8 overflow-hidden relative"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-brand-primary/2 via-brand-secondary/5 to-brand-primary/70 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-text-base mb-6 leading-tight"
          >
            Ready to <span className="text-brand-primary">Transform</span> Your
            Body?
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-text-muted mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Join{" "}
            <span className="text-brand-primary font-semibold">
              thousands of warriors
            </span>{" "}
            who’ve already started their journey with smart tracking, real
            progress, and zero excuses.
          </motion.p>

                    {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-10 py-5 bg-linear-to-r from-brand-primary to-brand-secondary text-black font-bold text-lg rounded-2xl shadow-2xl hover:shadow-brand-primary/50 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </motion.button>
            </Link>

            <Link to="/features" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-10 py-5 bg-surface-card/80 backdrop-blur-sm border-2 border-border-card text-text-base font-semibold text-lg rounded-2xl hover:bg-surface-card hover:border-brand-primary/50 transition-all duration-300 shadow-xl"
              >
                Explore Features
              </motion.button>
            </Link>
          </motion.div>   {/* ✅ THIS WAS MISSING */}

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-text-muted text-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-primary" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-primary" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-primary" />
              <span>Used by 50,000+ Fitness Enthusiasts</span>
            </div>
          </motion.div>

        </div>
      </motion.section>
    </div>
  );
};

export default Home;
