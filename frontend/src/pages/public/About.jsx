// src/pages/public/About.jsx
import React, { useRef } from "react";
import {
  Heart,
  Users,
  Target,
  TrendingUp,
  Award,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const About = () => {
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

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "2M+", label: "Workouts Logged" },
    { value: "5M+", label: "Meals Tracked" },
    { value: "98%", label: "User Satisfaction" },
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-brand-primary" />,
      title: "User-First Design",
      description:
        "Every feature is built with your experience in mind. We prioritize simplicity, speed, and accessibility.",
    },
    {
      icon: <Shield className="w-8 h-8 text-brand-primary" />,
      title: "Privacy & Security",
      description:
        "Your health data is encrypted and protected. We never sell your information to third parties.",
    },
    {
      icon: <Zap className="w-8 h-8 text-brand-primary" />,
      title: "Innovation Driven",
      description:
        "Constantly evolving with AI-powered insights and cutting-edge fitness technology.",
    },
    {
      icon: <Globe className="w-8 h-8 text-brand-primary" />,
      title: "Global Community",
      description:
        "Join fitness enthusiasts from around the world working toward their goals together.",
    },
  ];

  const team = [
    {
      role: "Mission",
      title: "Empowering Fitness Transformation",
      description:
        "Our mission is to make fitness tracking accessible, intelligent, and motivating for everyone. We believe data-driven insights can transform lives.",
    },
    {
      role: "Vision",
      title: "The Future of Fitness Tech",
      description:
        "We envision a world where everyone has the tools to optimize their health, powered by AI and personalized analytics.",
    },
    {
      role: "Values",
      title: "Built on Trust & Excellence",
      description:
        "Integrity, innovation, and user empowerment guide everything we do. Your success is our success.",
    },
  ];

  const milestones = [
    {
      year: "2021",
      title: "FitX Founded",
      description: "Started with a simple idea: make fitness tracking better.",
    },
    {
      year: "2022",
      title: "AI Integration",
      description: "Launched AI-powered calorie reports and smart insights.",
    },
    {
      year: "2023",
      title: "50K Users Milestone",
      description: "Hit 50,000 active users across 100+ countries.",
    },
    {
      year: "2024",
      title: "Advanced Analytics",
      description: "Released next-gen analytics dashboard and mobile app.",
    },
  ];

  return (
    <div className="bg-surface-background min-h-screen text-text-base overflow-hidden">
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
            Built for{" "}
            <span className="text-brand-primary">Peak Performance</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-text-muted max-w-3xl mx-auto mb-12"
          >
            FitX is more than a fitness app—it's your partner in
            transformation. Powered by intelligent analytics and designed for
            real results.
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-surface-card border border-border-card rounded-xl p-6"
              >
                <div className="text-4xl font-bold text-brand-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Our <span className="text-brand-primary">Story</span>
              </h2>
              <div className="space-y-4 text-text-muted text-lg leading-relaxed">
                <p>
                  FitX was born from a simple frustration: existing
                  fitness apps were either too complex or too basic. We wanted
                  something powerful yet intuitive.
                </p>
                <p>
                  What started as a side project quickly became a mission. We
                  built FitX to help everyday people take control of their
                  fitness with data-driven insights and intelligent tracking.
                </p>
                <p>
                  Today, we're proud to serve over 50,000 users worldwide,
                  helping them log millions of workouts and meals while crushing
                  their fitness goals.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <SpotlightCard>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-brand-primary/10 rounded-lg">
                      <Target className="w-8 h-8 text-brand-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-text-base text-lg">
                        Goal-Oriented
                      </div>
                      <div className="text-sm text-text-muted">
                        Every feature designed to help you succeed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-brand-primary/10 rounded-lg">
                      <Users className="w-8 h-8 text-brand-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-text-base text-lg">
                        Community First
                      </div>
                      <div className="text-sm text-text-muted">
                        Built with feedback from real users
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-brand-primary/10 rounded-lg">
                      <Award className="w-8 h-8 text-brand-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-text-base text-lg">
                        Results Driven
                      </div>
                      <div className="text-sm text-text-muted">
                        98% of users see measurable progress
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="text-brand-primary">Values</span>
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              The principles that guide everything we build and every decision
              we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex"
              >
                <SpotlightCard>
                  <div className="flex flex-col h-full">
                    <div className="mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-text-base">
                      {value.title}
                    </h3>
                    <p className="text-text-muted flex-1">
                      {value.description}
                    </p>
                    <div className="mt-auto" /> {/* keeps equal spacing */}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex"
              >
                <SpotlightCard>
                  <div className="flex flex-col h-full">
                    <div className="text-sm text-brand-primary font-semibold mb-3 uppercase tracking-wider">
                      {item.role}
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-text-base">
                      {item.title}
                    </h3>

                    <p className="text-text-muted leading-relaxed flex-1">
                      {item.description}
                    </p>

                    <div className="mt-auto" />
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="text-brand-primary">Journey</span>
            </h2>
            <p className="text-xl text-text-muted">
              Milestones that shaped FitX into what it is today.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex gap-6 items-start"
              >
                <div className="shrink-0 w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center border-2 border-brand-primary">
                  <span className="font-bold text-brand-primary">
                    {milestone.year}
                  </span>
                </div>
                <div className="flex-1 bg-surface-card border border-border-card rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-2 text-text-base">
                    {milestone.title}
                  </h3>
                  <p className="text-text-muted">{milestone.description}</p>
                </div>
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
            Join the <span className="text-brand-primary">FitX</span>{" "}
            Family
          </h2>
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
            Be part of a community that's transforming lives through intelligent
            fitness tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-linear-to-r from-brand-primary to-brand-secondary text-black font-bold text-lg rounded-2xl shadow-2xl hover:shadow-brand-primary/50 transition-all flex items-center justify-center gap-3 group"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </motion.button>
            </Link>
            <Link to="/features">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-surface-card/80 backdrop-blur-sm border-2 border-border-card text-text-base font-semibold text-lg rounded-2xl hover:border-brand-primary/50 transition-all"
              >
                Explore Features
              </motion.button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-text-muted text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-primary" />
              <span>Free Forever Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-primary" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-primary" />
              <span>Join 50K+ Users</span>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
