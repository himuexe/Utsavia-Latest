import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api/MyUserApi";
import { useDispatch } from "react-redux";
import { useNavigate , useLocation , Link } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';
import { showToast } from "../store/appSlice";

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
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
      dispatch(showToast({ message: 'Signed up successfully', type: 'SUCCESS' }));
      await queryClient.invalidateQueries("validateToken");
      
      // Check if we have booking details in the state
      if (location.state?.bookingDetails) {
        // If we have booking details, go directly to checkout
        navigate("/checkout", {
          state: { bookingDetails: location.state.bookingDetails },
          replace: true
        });
      } else {
        // Otherwise, go to the saved location or home
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    },
    onError: (error) => {
      dispatch(showToast({ message: error.message, type: 'ERROR' }));
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="w-full max-w-md mx-auto bg-black rounded-2xl shadow-lg p-8 mt-8 border border-zinc-800">
      <form
        className="flex flex-col gap-4"
        onSubmit={onSubmit}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create an Account
        </h2>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              First Name
            </label>
            <input
              className="w-full p-3 rounded-xl border border-zinc-800 
              focus:outline-none focus:ring-2 focus:ring-purple-600 
              bg-zinc-900 text-white placeholder-zinc-500"
              placeholder="Enter your first name"
              {...register("firstName", { required: "This field is required" })}
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm mt-1">{errors.firstName.message}</span>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Last Name
            </label>
            <input
              className="w-full p-3 rounded-xl border border-zinc-800 
              focus:outline-none focus:ring-2 focus:ring-purple-600 
              bg-zinc-900 text-white placeholder-zinc-500"
              placeholder="Enter your last name"
              {...register("lastName", { required: "This field is required" })}
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm mt-1">{errors.lastName.message}</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-400 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full p-3 rounded-xl border border-zinc-800 
            focus:outline-none focus:ring-2 focus:ring-purple-600 
            bg-zinc-900 text-white placeholder-zinc-500"
            placeholder="Enter your email"
            {...register("email", { required: "This field is required" })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-zinc-400 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 rounded-xl border border-zinc-800 
              focus:outline-none focus:ring-2 focus:ring-purple-600 
              bg-zinc-900 text-white placeholder-zinc-500 pr-10"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-purple-500 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-zinc-400 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full p-3 rounded-xl border border-zinc-800 
              focus:outline-none focus:ring-2 focus:ring-purple-600 
              bg-zinc-900 text-white placeholder-zinc-500 pr-10"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-purple-500 transition-colors"
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
          className="w-full bg-white text-black p-3 rounded-xl 
          hover:bg-zinc-200 transition-colors 
          hover:shadow-lg hover:shadow-purple-500/20"
        >
          Create Account
        </button>
        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/login"
            state={location.state} // Preserve the state when going back to login
            className="text-sm text-zinc-400 hover:text-purple-500 transition-colors"
          >
            Already have an account? Sign in
          </Link>
          <button
            type="submit"
            className="bg-white text-black px-6 py-2 rounded-xl 
            hover:bg-zinc-200 transition-colors 
            hover:shadow-lg hover:shadow-purple-500/20"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;