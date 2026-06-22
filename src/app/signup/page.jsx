"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaGoogle, FaEnvelope, FaLock, FaImage, FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
// Import your BetterAuth client wrapper instance
import { authClient } from "@/lib/auth-client"; 

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "", 
    email: "",
    imageUrl: "",
    password: "",
    confirmPassword: "",
    role: "user", // 🟢 Default fallback role selection value
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // 1. Password Match Validation Guard
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password validation failed. Passwords do not match!");
      return;
    }

    // 2. Minimum Length Password Guard
    if (formData.password.length < 6) {
      toast.error("Security weak. Password must be at least 6 characters long.");
      return;
    }
    
    setIsLoading(true);
    
    // Create loading toast reference instance
    const loadingToast = toast.loading("Processing credentials. Provisioning your profile node...");

    try {
      // 🟢 HARDCODED ADMIN PROVISIONING GUARD
      // Set your chosen secret email and password keys below
      const SECRET_ADMIN_EMAIL = "superadmin@ticketbari.com";
      const SECRET_ADMIN_PASSWORD = "SecretAdminPassword123";
      const DEFAULT_ADMIN_IMAGE = "https://cdn.pixabay.com/photo/2023/06/02/15/39/ai-generated-8035975_1280.png";

      let finalRole = formData.role;
      let finalName = formData.name || formData.email.split("@")[0];
      let finalImage = formData.imageUrl || null;

      if (formData.email.toLowerCase() === SECRET_ADMIN_EMAIL.toLowerCase() && formData.password === SECRET_ADMIN_PASSWORD) {
        finalRole = "admin";
        finalName = "ADMIN";
        finalImage = DEFAULT_ADMIN_IMAGE;
      }

      // BetterAuth Signup Core Request
      const { data, error } = await authClient.signUp.email({ 
        email: formData.email, 
        password: formData.password, 
        name: finalName, 
        image: finalImage,
        role: finalRole,
        additionalFields: {
          role: finalRole,
        }
      });

      if (error) {
        throw new Error(error.message || "Authentication rejected by server database.");
      }

      // Success Notification Handler
      toast.success("Account created successfully! Welcome to TicketBari.", {
        id: loadingToast,
        duration: 4000,
      });

      // Redirect user directly to home page or secure terminal entry point
      router.push("/");
      router.refresh();

    } catch (error) {
      console.error("Signup Terminal Error:", error);
      toast.error(error.message || "Registration failed. Please check parameters.", {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({ 
        provider: "google",
        callbackURL: "/" 
      });
    } catch (error) {
      console.error("OAuth Redirect Failure:", error);
      toast.error("Failed to initialize Google Authorization node.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-base-100 text-base-content overflow-hidden">
      {/* Background Tech Grids & Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--bc)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--bc)/0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/[0.03] dark:bg-amber-500/[0.05] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-md w-full bg-base-200/40 backdrop-blur-xl border border-base-content/10 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            CREATE ACCOUNT
          </h2>
          <p className="text-xs text-base-content/60 mt-2 uppercase tracking-widest font-mono">Join TicketBari Network</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* User Name Input Component */}
          <div className="form-control">
            <label className="label text-xs font-bold tracking-wide uppercase opacity-70 py-1">Full Name</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-base-content/40 text-sm font-mono">@</span>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full pl-11 bg-base-100/50 focus:border-amber-500 focus:outline-none transition-all rounded-xl text-sm"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="form-control">
            <label className="label text-xs font-bold tracking-wide uppercase opacity-70 py-1">Email Address</label>
            <div className="relative flex items-center">
              <FaEnvelope className="absolute left-4 text-base-content/40 text-xs" />
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full pl-11 bg-base-100/50 focus:border-amber-500 focus:outline-none transition-all rounded-xl text-sm"
                required
              />
            </div>
          </div>

          {/* 🟢 Choose System Access Role Dropdown (Admin option safely removed) */}
          <div className="form-control">
            <label className="label text-xs font-bold tracking-wide uppercase opacity-70 py-1">Select Profile Role</label>
            <div className="relative flex items-center">
              <FaUserCircle className="absolute left-4 text-base-content/40 text-xs z-10" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select select-bordered w-full pl-11 bg-base-100/50 focus:border-amber-500 focus:outline-none transition-all rounded-xl text-sm font-medium text-base-content/90"
                required
              >
                <option value="user">User (Standard Profile)</option>
                <option value="vendor">Vendor (Merchant Service)</option>
              </select>
            </div>
          </div>

          {/* Image URL Input */}
          <div className="form-control">
            <label className="label text-xs font-bold tracking-wide uppercase opacity-70 py-1">Profile Image URL</label>
            <div className="relative flex items-center">
              <FaImage className="absolute left-4 text-base-content/40 text-xs" />
              <input
                type="url"
                name="imageUrl"
                placeholder="https://image-link.com/avatar.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
                className="input input-bordered w-full pl-11 bg-base-100/50 focus:border-amber-500 focus:outline-none transition-all rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-control">
            <label className="label text-xs font-bold tracking-wide uppercase opacity-70 py-1">Password</label>
            <div className="relative flex items-center">
              <FaLock className="absolute left-4 text-base-content/40 text-xs" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full pl-11 pr-11 bg-base-100/50 focus:border-amber-500 focus:outline-none transition-all rounded-xl text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-base-content/40 hover:text-base-content/80 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="form-control">
            <label className="label text-xs font-bold tracking-wide uppercase opacity-70 py-1">Confirm Password</label>
            <div className="relative flex items-center">
              <FaLock className="absolute left-4 text-base-content/40 text-xs" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input input-bordered w-full pl-11 pr-11 bg-base-100/50 focus:border-amber-500 focus:outline-none transition-all rounded-xl text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-base-content/40 hover:text-base-content/80 transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 border-none text-slate-950 font-black rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wider text-xs"
          >
            {isLoading ? <span className="loading loading-spinner loading-xs" /> : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="divider text-xs my-5 uppercase opacity-40 font-mono tracking-widest">Or Continue With</div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignIn}
          className="btn btn-outline w-full flex items-center justify-center gap-3 border-base-content/20 hover:bg-base-300 rounded-xl font-bold text-xs uppercase transition-all"
        >
          <FaGoogle className="text-red-500" />
          <span>Google Access Node</span>
        </button>

        {/* Account Redirect Footer */}
        <p className="text-center text-xs mt-6 text-base-content/60">
          Already registered on the platform?{" "}
          <Link href="/login" className="text-amber-500 hover:underline font-bold transition-all ml-1">
            Login Terminal
          </Link>
        </p>
      </div>
    </div>
  );
}