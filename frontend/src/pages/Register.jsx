import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api/MyUserApi";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Success!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 mt-8 border border-purple-100">
      <form
        className="flex flex-col gap-4"
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center bg-clip-text text-slate-700 font-primary mb-6">
          Create an Account
        </h2>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-secondary text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              className="w-full p-3 rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/70 backdrop-blur-sm"
              placeholder="Enter your first name"
              {...register("firstName", { required: "This field is required" })}
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm mt-1">{errors.firstName.message}</span>
            )}
          </div>
          <div className="flex-1">
            <label className="block font-secondary text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              className="w-full p-3 rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/70 backdrop-blur-sm"
              placeholder="Enter your last name"
              {...register("lastName", { required: "This field is required" })}
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm mt-1">{errors.lastName.message}</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-secondary text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full p-3 rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/70 backdrop-blur-sm"
            placeholder="Enter your email"
            {...register("email", { required: "This field is required" })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="block font-secondary text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/70 backdrop-blur-sm pr-10"
              placeholder="Enter your password"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="block font-secondary text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full p-3 rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/70 backdrop-blur-sm pr-10"
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                validate: (val) => {
                  if (!val) {
                    return "This field is required";
                  } else if (watch("password") !== val) {
                    return "Your passwords do not match";
                  }
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg font-happiness shadow-purple-200"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Register;