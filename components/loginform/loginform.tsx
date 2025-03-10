"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { loginSuccess } from "@/features/search/searchSlice";
import { Button } from "@heroui/react";
import Cookies from "js-cookie";

export default function LogInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(data.user));
      Cookies.set("isLoggedIn", "true", { expires: 1 });

      dispatch(loginSuccess({ user: data.user, token: data.token }));
      router.push("/blog");
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="bg-white shadow-2xl p-8 rounded-xl w-full max-w-md border border-gray-200">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Logo" className="h-12" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Sign in to your account
        </h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 mt-1 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 mt-1 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a href="/forgot-password" className="text-blue-500 hover:underline text-sm">
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Sign In
          </Button>

          {/* OR Divider */}
          <div className="flex items-center justify-center gap-2 my-3">
            <span className="h-px w-full bg-gray-300"></span>
            <span className="text-gray-600 text-sm">OR</span>
            <span className="h-px w-full bg-gray-300"></span>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 bg-white text-gray-800 font-bold rounded-lg shadow-md border border-gray-300 hover:bg-gray-100 transition-all duration-300"
          >
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            Continue with Google
          </button>

          {/* Signup Redirect */}
          <p className="text-center text-gray-600 text-sm mt-3">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
