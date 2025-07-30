import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserPlus } from "react-icons/fa";
import { IoWarning, IoEye, IoEyeOff } from "react-icons/io5";

interface FormErrors {
    full_name?: string;
    email?: string;
    password?: string;
    default?: string;
}

interface ApiResponse {
    message: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [Type, setType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    full_name: "",
    email: "",
    password: "",
    type: "",
  });

  // Move URL parameter handling to useEffect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type") || "";
    setType(typeParam);
    setUser(prev => ({ ...prev, type: typeParam }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({} as FormErrors);

    if (!user.full_name || !user.email || !user.password) {
        setErrors({
            full_name: !user.full_name ? "Required" : "",
            email: !user.email ? "Required" : "",
            password: !user.password ? "Required" : "",
        });
        return;
    }

    setLoading(true);

      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    try {
        const response = await fetch(`${backendUrl}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        const data: ApiResponse = await response.json();

        if (response.ok) {
            toast.success("Registration successful! Please sign in.");
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
    <div className="min-h-screen w-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-fuchsia-900 via-black to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_8px_at_center,theme(colors.fuchsia.400/20)_1px,transparent_0)] bg-[size:24px_24px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="backdrop-blur-xl bg-white/90 p-8 rounded-2xl shadow-xl"
>
  <div className="text-center mb-10">
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="inline-flex items-center justify-center w-20 h-20 rounded-full 
                 bg-gradient-to-r from-indigo-500 to-purple-500 mb-6 shadow-lg shadow-purple-500/25"
    >
      <FaUserPlus className="w-10 h-10 text-white" />
    </motion.div>
    <h1 className="text-3xl font-bold text-gray-900">
      Join Us
    </h1>
    <p className="mt-2 text-gray-600">Create your account to get started</p>
  </div>

  {errors.default && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm"
    >
      <div className="flex items-center gap-2">
        <IoWarning className="w-5 h-5" />
        <span>{errors.default}</span>
      </div>
    </motion.div>
  )}

  <form onSubmit={handleSubmit} className="space-y-5">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Full Name
      </label>
      <motion.input
        type="text"
        value={user.full_name}
        onChange={(e) => setUser({ ...user, full_name: e.target.value })}
        placeholder="Enter your full name"
        className={`w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900 
                   placeholder:text-gray-400 transition-all duration-200
                   ${errors.full_name
          ? "border-2 border-rose-500 focus:border-rose-500"
          : "border border-gray-200 focus:border focus:border-purple-500"
        } outline-none`}
      />
      {errors.full_name && (
        <p className="mt-1.5 text-rose-500 text-sm">{errors.full_name}</p>
      )}
    </div>

    {/* Similar styling for email input */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Email Address
      </label>
      <motion.input
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Enter your email"
        className={`w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900 
                   placeholder:text-gray-400 transition-all duration-200
                   ${errors.email
          ? "border-2 border-rose-500 focus:border-rose-500"
          : "border border-gray-200 focus:border focus:border-purple-500"
        } outline-none`}
      />
      {errors.email && (
        <p className="mt-1.5 text-rose-500 text-sm">{errors.email}</p>
      )}
    </div>

    {/* Password input with similar styling */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Password
      </label>
      <div className="relative">
        <motion.input
          type={showPassword ? "text" : "password"}
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Create a password"
          className={`w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900 
                     placeholder:text-gray-400 transition-all duration-200
                     ${errors.password
            ? "border-2 border-rose-500 focus:border-rose-500"
            : "border border-gray-200 focus:border focus:border-purple-500"
          } outline-none`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
        </button>
      </div>
      {errors.password && (
        <p className="mt-1.5 text-rose-500 text-sm">{errors.password}</p>
      )}
    </div>

    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      type="submit"
      disabled={loading}
      className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 
                 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25
                 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200
                 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Creating Account...</span>
        </div>
      ) : (
        "Create Account"
      )}
    </motion.button>
  </form>

  <p className="mt-8 text-center text-gray-600">
    Already have an account?{" "}
    <Link
      to={`/login?type=${Type}`}
      className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
    >
      Sign In
    </Link>
  </p>
</motion.div>
      </motion.div>
    </div>
  );
};

export default Register;