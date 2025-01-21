import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api/MyUserApi";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Heart } from 'lucide-react';
import { showToast } from "../store/appSlice";

const SignIn = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      dispatch(showToast({ message: 'Signed in successfully', type: 'SUCCESS' }));
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
    onError: async (error) => {
      dispatch(showToast({ message: error.message, type: 'ERROR' }));
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const handleGoogleSignIn = () => {
    apiClient.googleSignIn();
  };

  // Check if the user is coming from the booking page
  const isFromBooking = location.state?.fromBooking;

  return (
    <div className="w-full max-w-md mx-auto bg-black rounded-2xl shadow-lg p-8 mt-8 border border-zinc-800">
      <form
        className="flex flex-col gap-4"
        onSubmit={onSubmit}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Welcome Back
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-400 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-xl border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-600 
            bg-zinc-900 text-white placeholder-zinc-500"
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
              placeholder="Enter your password"
              className="w-full p-3 rounded-xl border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-600 
              bg-zinc-900 text-white placeholder-zinc-500 pr-10"
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

        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/register" 
            state={location.state}
            className="text-sm text-zinc-400 hover:text-purple-500 
              transition-colors flex items-center gap-1"
          >
            <Heart className="w-4 h-4" />
            Create Account
          </Link>
          <button
            type="submit"
            className="bg-white text-black px-6 py-2 rounded-xl 
            hover:bg-zinc-200 transition-colors 
            hover:shadow-lg hover:shadow-purple-500/20"
          >
            Login
          </button>
        </div>

        {/* Conditionally render the Google Sign-In button */}
        {!isFromBooking && (
          <>
            <div className="relative flex items-center gap-4 mb-4">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="text-zinc-500 text-sm">or</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 
              bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl 
              hover:bg-zinc-800 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default SignIn;