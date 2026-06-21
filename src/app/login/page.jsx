"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// Import your BetterAuth client wrapper instance
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Create loading toast reference instance
    const loadingToast = toast.loading("Verifying security clearance coordinates...");

    try {
      // BetterAuth Sign In Core Request
      const { data, error } = await authClient.signIn.email({ 
        email: formData.email, 
        password: formData.password,
      });

      if (error) {
        // BetterAuth handles incorrect emails/passwords natively inside the error block
        throw new Error(error.message || "Invalid authentication credentials.");
      }

      // Success Notification Handler
      toast.success("Authorization granted! Welcome back.", {
        id: loadingToast,
        duration: 3000,
      });

      // Redirect user directly to the home page terminal context
      router.push("/");
      router.refresh();

    } catch (error) {
      console.error("Login Terminal Failure:", error);
      toast.error(error.message || "Access Denied. Check your input matrices.", {
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
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-orange-500/[0.03] dark:bg-orange-500/[0.05] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-md w-full bg-base-200/40 backdrop-blur-xl border border-base-content/10 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            ACCESS TERMINAL
          </h2>
          <p className="text-xs text-base-content/60 mt-2 uppercase tracking-widest font-mono">Welcome back to TicketBari</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="form-control">
            <label className="label text-xs font-bold tracking-wide uppercase opacity-70">Email Address</label>
            <div className="relative flex items-center">
              <FaEnvelope className="absolute left-4 text-base-content/40 text-sm" />
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

          {/* Password Input */}
          <div className="form-control">
            <div className="flex justify-between items-center px-1">
              <label className="label text-xs font-bold tracking-wide uppercase opacity-70 p-0">Password</label>
              <Link href="#" className="text-[11px] text-amber-500 hover:underline tracking-tight">
                Forgot Coordinates?
              </Link>
            </div>
            <div className="relative flex items-center mt-1">
              <FaLock className="absolute left-4 text-base-content/40 text-sm" />
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 border-none text-slate-950 font-black rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wider text-xs"
          >
            {isLoading ? <span className="loading loading-spinner loading-xs" /> : "Authorize Entry"}
          </button>
        </form>

        {/* Divider */}
        <div className="divider text-xs my-6 uppercase opacity-40 font-mono tracking-widest">Or Continue With</div>

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
          New to the transit platform?{" "}
          <Link href="/signup" className="text-amber-500 hover:underline font-bold transition-all ml-1">
            Initialize Account
          </Link>
        </p>
      </div>
    </div>
  );
}