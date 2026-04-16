// src/components/feedback/FeedbackModal.jsx

import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Send,
  X,
  AlertCircle,
  Sparkles,
  Bug,
  Lightbulb,
} from "lucide-react";

const feedbackTypes = [
  {
    value: "bug",
    label: "Report a Bug",
    icon: Bug,
    color: "text-error",
  },
  {
    value: "feature",
    label: "Suggest a Feature",
    icon: Lightbulb,
    color: "text-brand-primary",
  },
  {
    value: "improvement",
    label: "UI/UX Improvement",
    icon: Sparkles,
    color: "text-purple-400",
  },
  {
    value: "general",
    label: "General Feedback",
    icon: MessageSquare,
    color: "text-text-muted",
  },
];

export default function FeedbackModal({ isOpen, onClose }) {
  const [type, setType] = useState("feature");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please write your feedback");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/api/feedback/", {
        type,
        message: message.trim(),
      });

      toast.success("Thanks for your feedback!", {
        icon: "✨",
        duration: 3500,
      });

      setMessage("");
      setType("feature");
      onClose();
    } catch (err) {
      toast.error("Failed to send feedback. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedType = feedbackTypes.find((t) => t.value === type);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-card border border-border-card rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-brand-primary/40 to-brand-secondary p-6 border-b border-border-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-primary/20 rounded-xl">
                <MessageSquare className="w-8 h-8 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-base">
                  Send Feedback
                </h2>
                <p className="text-text-base text-sm">
                  Help us make FitX better!
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-brand-tertiary/80 rounded-lg transition-all"
            >
              <X size={24} className="text-text-base" />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Feedback Type Selector */}
          <div>
            <label className="block text-sm font-medium text-text-base mb-3">
              What kind of feedback?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {feedbackTypes.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setType(item.value)}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      type === item.value
                        ? "border-brand-primary bg-brand-primary/10 shadow-lg"
                        : "border-border-card hover:border-brand-primary/50 bg-surface-card-alt"
                    }`}
                  >
                    <Icon size={20} className={item.color} />
                    <span className="text-sm font-medium text-text-base">
                      {item.label}
                    </span>
                    {type === item.value && (
                      <div className="ml-auto w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-sm font-medium text-text-base mb-3">
              Your Message <span className="text-error">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Tell us about the ${selectedType?.label.toLowerCase()}...`}
              rows="6"
              className="w-full px-4 py-3 bg-surface-card-alt border border-border-card rounded-xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all resize-none placeholder-text-muted"
              required
            />
            <p className="text-xs text-text-muted mt-2">
              {message.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-border-card rounded-xl hover:bg-surface-hover transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="px-8 py-3 bg-linear-to-r from-brand-primary to-brand-tertiary text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3"
            >
              {loading ? (
                <>Sending...</>
              ) : (
                <>
                  <Send size={20} />
                  Send Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
