// src/pages/legal/PrivacyPolicy.jsx

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-page text-text-base">
      <div className="bg-surface-card border-b border-border-card sticky top-0 z-10">
        <div className=" mx-auto px-6 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-text-muted hover:text-brand-primary transition cursor-pointer"
          >
            <ArrowLeft size={24} />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-black text-brand-primary">
            Privacy Policy
          </h1>
          <div className="w-32" />
        </div>
      </div>

      <div className=" mx-auto p-6 md:p-10 space-y-10">
        <div className="bg-surface-card border border-border-card rounded-3xl p-10 shadow-2xl">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-4xl font-black text-brand-primary mb-8">
              Privacy Policy
            </h2>
            <p className="text-lg text-text-muted mb-8">
              Last updated: November 25, 2025
            </p>

            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-brand-secondary">
                Your Privacy Matters
              </h3>
              <p>
                We take your privacy seriously. This policy explains how we
                collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-brand-secondary">
                Information We Collect
              </h3>
              <ul className="list-disc pl-6 space-y-3 text-text-muted">
                <li>Account information (name, email, profile picture)</li>
                <li>Fitness data (workouts, weight, measurements)</li>
                <li>Usage data (app interactions, preferences)</li>
                <li>Device information (for analytics and debugging)</li>
              </ul>
            </section>

            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-brand-secondary">
                How We Use Your Data
              </h3>
              <ul className="list-disc pl-6 space-y-3 text-text-muted">
                <li>To provide and improve the FitX experience</li>
                <li>To show your progress and insights</li>
                <li>To send important notifications (if enabled)</li>
                <li>To analyze usage and fix bugs</li>
              </ul>
            </section>

            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-brand-secondary">
                Data Security
              </h3>
              <p>
                We use industry-standard encryption and security practices to
                protect your data. Your fitness journey is private and secure.
              </p>
            </section>

            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-brand-secondary">
                Your Rights
              </h3>
              <ul className="list-disc pl-6 space-y-3 text-text-muted">
                <li>Access your data anytime</li>
                <li>Export your data</li>
                <li>Delete your account permanently</li>
                <li>Control notifications and preferences</li>
              </ul>
            </section>

            <div className="mt-16 pt-10 border-t border-border-card text-center">
              <p className="text-text-muted">
                We respect your privacy • Your data belongs to you • Always
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
