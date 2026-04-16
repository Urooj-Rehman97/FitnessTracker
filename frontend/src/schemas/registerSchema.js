// src/schemas/registerSchema.js
import * as yup from "yup";

export const step1Schema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username too long"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const step2Schema = yup.object({
  gender: yup.string().required("Gender is required"),
  age: yup
    .number()
    .typeError("Age must be a valid number")
    .required("Age is required")
    .positive("Age must be positive")
    .integer("Age must be a whole number")
    .max(120, "Age seems too high"),
  height: yup
    .number()
    .typeError("Height must be a valid number")
    .required("Height is required")
    .positive("Height must be positive")
    .min(100, "Height must be at least 100 cm")
    .max(250, "Height seems too high"),
  weight: yup
    .number()
    .typeError("Weight must be a valid number")
    .required("Weight is required")
    .positive("Weight must be positive")
    .min(30, "Weight must be at least 30 kg")
    .max(300, "Weight seems too high"),
});

export const step3Schema = yup.object({
  fitnessGoal: yup.string().required("Fitness goal is required"),
  activityLevel: yup.string().required("Activity level is required"),
});
