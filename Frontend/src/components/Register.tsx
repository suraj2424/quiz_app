import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserPlus } from "react-icons/fa";

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

    try {
        const response = await fetch("http://localhost:5000/api/register", {
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
        <div className="backdrop-blur-xl bg-slate-100 bg-opacity-50 p-8 rounded-lg border border-gray-500/20 shadow-2xl shadow-fuchsia-500/10">
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 mb-4"
            >
              <FaUserPlus className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-violet-400">
              Create Account
            </h1>
          </div>

          {errors.default && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
            >
              {errors.default}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <motion.input
                type="text"
                value={user.full_name}
                onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                placeholder="Full Name"
                className={`w-full px-4 py-2 bg-slate-50 border rounded text-sky-500 
                placeholder:text-gray-500/50 transition-colors duration-300 outline-none 
                backdrop-blur-xl ${
                  errors.full_name
                    ? "border-red-500/50 focus:border-red-400"
                    : "border-gray-500/30 focus:border-gray-400"
                }`}
              />
              {errors.full_name && (
                <p className="mt-1 text-red-400 text-xs">{errors.full_name}</p>
              )}
            </div>

            <div>
              <motion.input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email Address"
                className={`w-full px-4 py-2 bg-slate-50 border rounded text-sky-500 
                placeholder:text-gray-500/50 transition-colors duration-300 outline-none 
                backdrop-blur-xl ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-400"
                    : "border-gray-500/30 focus:border-gray-400"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-red-400 text-xs">{errors.email}</p>
              )}
            </div>

            <div>
              <motion.input
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="Password"
                className={`w-full px-4 py-2 bg-slate-50 border rounded text-sky-500 
                placeholder:text-gray-500/50 transition-colors duration-300 outline-none 
                backdrop-blur-xl ${
                  errors.password
                    ? "border-red-500/50 focus:border-red-400"
                    : "border-gray-500/30 focus:border-gray-400"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-red-400 text-xs">{errors.password}</p>
              )}
            </div>

            <div className="space-x-2">
                <input 
                  type="checkbox"  
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label className="font-light">Show password</label>
            </div>

            <div className="flex justify-center items-center">
              <motion.button
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-1/2 py-3 bg-gradient-to-r from-sky-600 to-violet-600 
                text-white rounded font-bold relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                {loading ? (
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </div>
          </form>

          <p className="mt-6 text-center text-gray-500">
            Already have an account?{" "}
            <Link
              to={`/login?type=${Type}`}
              className="text-sky-400 transition-colors"
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