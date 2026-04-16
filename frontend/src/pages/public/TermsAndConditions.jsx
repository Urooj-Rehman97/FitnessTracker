// src/pages/legal/TermsAndConditions.jsx

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-page text-text-base">
      {/* Header */}
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
            Terms & Conditions
          </h1>
          <div className="w-32" />
        </div>
      </div>

      {/* Content */}
      <div className=" mx-auto p-6 md:p-10 space-y-10">
        <div className="bg-surface-card border border-border-card rounded-3xl p-10 shadow-2xl">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-4xl font-black text-brand-primary mb-8">
              Terms of Service
            </h2>
            <p className="text-lg text-text-muted mb-8">
              Last updated: November 25, 2025
            </p>

            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-brand-secondary">
                1. Acceptance of Terms
              </h3>
              <p>
                By using FitX, you agree to be bound by these Terms of
                Service. If you don't agree, please don't use the app.
              </p>
            </section>

            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-brand-secondary">
                2. Use of Service
              </h3>
              <ul className="list-disc pl-6 space-y-3 text-text-muted">
                <li>You must be at least 13 years old to use FitX</li>
                <li>
                  You are responsible for maintaining the security of your
                  account
                </li>
                <li>
                  Do not misuse the service or interfere with its operation
                </li>
                <li>
                  We reserve the right to suspend or terminate accounts for
                  violations
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-brand-secondary">
                3. User Content
              </h3>
              <p>
                You own your workout data, progress photos, and personal
                information. You grant FitX a non-exclusive license to
                display and store this content.
              </p>
            </section>

            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-brand-secondary">
                4. Health & Safety
              </h3>
              <p className="bg-error/20 border border-error/50 rounded-xl p-6 text-text-base">
                <strong>Important:</strong> FitX is not a medical device.
                Always consult a healthcare professional before starting any
                fitness program. You use this app at your own risk.
              </p>
            </section>

            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-brand-secondary">
                5. Changes to Terms
              </h3>
              <p>
                We may update these terms. Continued use of FitX after
                changes constitutes acceptance of the new terms.
              </p>
            </section>

            <div className="mt-16 pt-10 border-t border-border-card text-center">
              <p className="text-text-muted">
                © 2025 FitX • Made with{" "}
                <span className="text-red-500">❤️</span> for fitness beasts like
                you
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
