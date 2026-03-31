import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  IoRocket, 
  IoPerson, 
  IoMail, 
  IoLockClosed, 
  IoEye, 
  IoEyeOff, 
  IoWarning 
} from "react-icons/io5";

// Using your existing component
import ThemeToggle from "../common/ThemeToggle"; 

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- Form Logic State ---
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [type, setType] = useState("");
  const [user, setUser] = useState({
    full_name: "",
    email: "",
    password: "",
    type: "",
  });

  // Handle URL parameter for user type
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type") || "";
    setType(typeParam);
    setUser(prev => ({ ...prev, type: typeParam }));
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!user.full_name || !user.email || !user.password) {
      setErrors({
        full_name: !user.full_name ? "Name Required" : "",
        email: !user.email ? "Email Required" : "",
        password: !user.password ? "Password Required" : "",
      });
      return;
    }

    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      
      const data = await response.json();

      if (response.ok) {
        toast.success("REGISTRATION SUCCESSFUL");
        navigate("/login");
      } else {
        setErrors({
          email: data.message === "Email already exists" ? data.message : "",
          default: data.message || "Registration failed",
        });
      }
    } catch (error) {
      setErrors({ default: "Connection error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-white dark:bg-[#0D0221] transition-colors duration-300">
      
      {/* Theme Toggle from your common components */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500/10 via-transparent to-transparent dark:from-fuchsia-500/5" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="bg-white dark:bg-slate-900 border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(192,38,211,1)] transition-all">
          
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-fuchsia-500 border-[3px] border-black p-3 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <IoRocket className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter dark:text-white">
              Join Us
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">
              Create your account to proceed
            </p>
          </div>

          {/* Global Error Display */}
          {errors.default && (
            <div className="mb-6 p-4 bg-rose-500 border-[3px] border-black text-white font-black flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <IoWarning className="w-6 h-6 shrink-0" />
              <span className="uppercase text-xs">{errors.default}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Full Name</label>
              <div className="relative">
                <IoPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-black dark:text-fuchsia-500" size={20} />
                <input
                  type="text"
                  placeholder="NAME"
                  value={user.full_name}
                  onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                  className={`w-full pl-12 pr-4 py-4 border-[3px] border-black font-bold uppercase bg-white dark:bg-[#0D0221] dark:text-white outline-none transition-all ${
                    errors.full_name ? "border-rose-500 ring-2 ring-rose-500" : "focus:bg-fuchsia-50 dark:focus:bg-fuchsia-900/20"
                  }`}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Email Address</label>
              <div className="relative">
                <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 text-black dark:text-fuchsia-500" size={20} />
                <input
                  type="email"
                  placeholder="EMAIL@DOMAIN.COM"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className={`w-full pl-12 pr-4 py-4 border-[3px] border-black font-bold uppercase bg-white dark:bg-[#0D0221] dark:text-white outline-none transition-all ${
                    errors.email ? "border-rose-500 ring-2 ring-rose-500" : "focus:bg-fuchsia-50 dark:focus:bg-fuchsia-900/20"
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Security Key</label>
              <div className="relative">
                <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-black dark:text-fuchsia-500" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  className={`w-full pl-12 pr-12 py-4 border-[3px] border-black font-bold bg-white dark:bg-[#0D0221] dark:text-white outline-none transition-all ${
                    errors.password ? "border-rose-500 ring-2 ring-rose-500" : "focus:bg-fuchsia-50 dark:focus:bg-fuchsia-900/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black dark:text-fuchsia-500 hover:scale-110 transition-transform"
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-5 border-[3px] border-black font-black uppercase italic text-xl shadow-[6px_6px_0px_0px_rgba(192,38,211,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-8 text-center font-black uppercase text-[10px] tracking-widest dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to={`/login?type=${type}`}
              className="text-fuchsia-600 dark:text-fuchsia-400 hover:underline decoration-[2px] underline-offset-2"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;