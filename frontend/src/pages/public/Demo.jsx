// src/pages/public/Demo.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Dumbbell,
  Activity,
  LineChart,
  Calendar,
  Target,
  TrendingUp,
  ChevronRight,
  CheckCircle,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const Demo = () => {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false); 
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const videoSources = [
    "/videos/nutrition__log.mp4",
    "/videos/Workouts.mp4",
    "/videos/Dashboard-Overview.mp4",
    "/videos/Progess_Log.mp4",
  ];

  // Load video when section changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load(); 
    setProgress(0);
    setIsPlaying(false);

    // Reset src to trigger reload
    video.src = videoSources[currentDemo];
  }, [currentDemo]);

  // Play/Pause Logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasInteracted) return;

    const playVideo = async () => {
      try {
        if (isPlaying) {
          await video.play();
        } else {
          video.pause();
        }
      } catch (err) {
        console.warn("Play interrupted:", err);
        setIsPlaying(false);
      }
    };

    playVideo();
  }, [isPlaying, hasInteracted]);

  // Progress Update
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        setProgress(percent);
      }
    };

    const id = setInterval(updateProgress, 100);
    intervalRef.current = id;

    const handleEnded = () => {
      handleNext();
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", updateProgress);

    return () => {
      clearInterval(id);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, [currentDemo]);

  const handlePlayPause = async () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentDemo((prev) => (prev + 1) % videoSources.length);
  };

  const handlePrevious = () => {
    setCurrentDemo(
      (prev) => (prev - 1 + videoSources.length) % videoSources.length
    );
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentDuration = videoRef.current?.duration || 0;

  return (
    <div className="bg-surface-background min-h-screen text-text-base">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Watch FitXin{" "}
            <span className="text-brand-primary">Action</span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Real demo videos — click play to start!
          </p>
        </div>
      </motion.section>

      {/* Main Player */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface-card border border-border-card backdrop-blur-xl rounded-xl p-8 shadow-lg">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Video Player */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-surface-card-alt rounded-xl overflow-hidden border border-border-card aspect-video relative group">
                  <video
                    ref={videoRef}
                    src={videoSources[currentDemo]}
                    className="w-full h-full object-contain bg-black"
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    onClick={handlePlayPause}
                  />
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={handlePlayPause}
                      className="bg-brand-primary/90 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-xl hover:bg-brand-primary transition"
                    >
                      {isPlaying ? (
                        <Pause className="w-10 h-10" />
                      ) : (
                        <Play className="w-10 h-10 ml-1" />
                      )}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-hover">
                    <div
                      className="h-full bg-brand-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handlePrevious}
                      className="p-3 bg-surface-card-alt rounded-lg hover:bg-brand-primary hover:text-white transition"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handlePlayPause}
                      className="p-3 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-3 bg-surface-card-alt rounded-lg hover:bg-brand-primary hover:text-white transition"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                    <button
                      onClick={toggleMute}
                      className="p-3 bg-surface-card-alt rounded-lg hover:bg-brand-primary hover:text-white transition"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="text-sm text-text-muted font-medium">
                    {formatTime((progress / 100) * currentDuration)} /{" "}
                    {formatTime(currentDuration)}
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {demoSections[currentDemo].icon}
                    <h2 className="text-2xl font-bold">
                      {demoSections[currentDemo].title}
                    </h2>
                  </div>
                  <p className="text-text-muted">
                    {demoSections[currentDemo].description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {demoSections[currentDemo].features.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-text-muted">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section List */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold mb-4">Demo Sections</h3>
                {demoSections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentDemo(s.id);
                      setIsPlaying(false);
                      setProgress(0);
                    }}
                    className={`w-full text-left p-4 rounded-lg border transition-all text-sm ${
                      currentDemo === s.id
                        ? "bg-brand-primary/10 border-brand-primary"
                        : "bg-surface-card-alt border-border-card hover:border-brand-primary/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {s.icon}
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-xs text-text-muted">
                          Click to load
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
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

const demoSections = [
  {
    id: 0,
    title: "Dashboard Overview",
    icon: <LineChart className="w-8 h-8 text-brand-primary" />,
    description:
      "Get a comprehensive view of your fitness journey at a glance.",
    features: [
      "Real-time metrics",
      "Recent activities",
      "Progress indicators",
      "Insights",
    ],
  },
  {
    id: 1,
    title: "Workout Tracking",
    icon: <Dumbbell className="w-8 h-8 text-brand-primary" />,
    description:
      "Log exercises with sets, reps, and weights. Track strength progress.",
    features: [
      "Easy logging",
      "Custom routines",
      "Progress tracking",
      "Rest timer",
    ],
  },
  {
    id: 2,
    title: "Nutrition Monitoring",
    icon: <Activity className="w-8 h-8 text-brand-primary" />,
    description:
      "Track meals, calories, and macros. Meet your nutritional goals.",
    features: ["Calorie tracking", "Meal history", "Insights", "Food database"],
  },
  {
    id: 3,
    title: "Progress Analytics",
    icon: <TrendingUp className="w-8 h-8 text-brand-primary" />,
    description:
      "Visualize your journey with charts. Track weight and performance.",
    features: [
      "Interactive charts",
      "Trend analysis",
      "Comparisons",
      "Export reports",
    ],
  },
];

export default Demo;
