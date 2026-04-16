// pages/auth/Register.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  step1Schema,
  step2Schema,
  step3Schema,
} from "../../schemas/registerSchema";

import Step1Account from "../../components/register/Step1Account";
import Step2Personal from "../../components/register/Step2Personal";
import Step3Fitness from "../../components/register/Step3Fitness";
import Step4Review from "../../components/register/Step4Review";

const steps = [
  { id: 1, title: "Account Setup" },
  { id: 2, title: "Personal Info" },
  { id: 3, title: "Fitness Profile" },
  { id: 4, title: "Review & Submit" },
];

const getSchemaForStep = (step) => {
  switch (step) {
    case 1:
      return step1Schema;
    case 2:
      return step2Schema;
    case 3:
      return step3Schema;
    default:
      return null;
  }
};

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const savedData = localStorage.getItem("registerData");
  const initialValues = savedData
    ? JSON.parse(savedData)
    : {
        username: "",
        email: "",
        password: "",
        gender: "",
        age: "",
        height: "",
        weight: "",
        fitnessGoal: "",
        activityLevel: "",
      };

  const schema = getSchemaForStep(step);
  const methods = useForm({
    resolver: schema ? yupResolver(schema) : undefined,
    mode: "onChange",
    defaultValues: initialValues,
  });

  const {
    trigger,
    formState: { isValid },
    watch,
  } = methods;

  // Save to localStorage
  React.useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem("registerData", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const nextStep = async () => {
    const valid = await trigger();
    if (valid) setStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        data
      );
      if (res.data.success) {
        toast.success("Registration successful! Check your email to verify.");
        localStorage.removeItem("registerData");
        methods.reset();
        setTimeout(() => {
          toast.dismiss();
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      setLoading(false);

      toast.error(err.response?.data?.message || "Registration failed!");
    }
  };

  const variants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Account />;
      case 2:
        return <Step2Personal />;
      case 3:
        return <Step3Fitness />;
      case 4:
        return <Step4Review />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface-background flex flex-col justify-center items-center p-6 text-text-base">
      <Toaster position="top-center" />

      {/* Progress Bar */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((s) => (
            <span
              key={s.id}
              className={`text-sm ${
                step >= s.id ? "text-brand-primary" : "text-text-muted"
              }`}
            >
              {s.title}
            </span>
          ))}
        </div>
        <div className="w-full h-2 bg-surface-card rounded-full">
          <motion.div
            className="h-2 bg-brand-primary rounded-full"
            animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form */}
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="w-full max-w-xl bg-surface-card p-6 rounded-2xl shadow-lg border border-border-card"
        >
          <motion.div
            key={step}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-surface-hover text-text-base rounded-lg hover:bg-surface-card-alt transition"
              >
                Back
              </button>
            )}

            {step < steps.length && (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isValid}
                className={`px-4 py-2 rounded-lg transition ${
                  isValid
                    ? "bg-brand-primary hover:bg-brand-secondary text-white"
                    : "bg-surface-hover text-text-muted cursor-not-allowed"
                }`}
              >
                Next
              </button>
            )}

            {step === steps.length && (
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 flex items-center justify-center gap-2 
    bg-success text-white rounded-lg transition 
    ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-success/90"}`}
              >
                {loading ? (
                  <>
                    <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            )}
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <span className="text-text-muted">Already have an account? </span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-brand-primary font-semibold hover:underline"
          >
            Login
          </button>
        </div>
      </FormProvider>
    </div>
  );
};

export default Register;
