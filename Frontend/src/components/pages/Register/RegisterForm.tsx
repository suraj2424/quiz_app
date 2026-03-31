import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  IoPerson, 
  IoMail, 
  IoLockClosed, 
  IoEye, 
  IoEyeOff, 
  IoWarning, 
  IoRocket 
} from "react-icons/io5";
import { RegisterFormProps } from "./types";

const RegisterForm: React.FC<RegisterFormProps> = ({
  user,
  setUser,
  errors,
  loading,
  showPassword,
  setShowPassword,
  handleSubmit,
  type,
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-white dark:bg-[#0D0221] transition-colors duration-300">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="bg-white dark:bg-[#1a1a2e] border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(192,38,211,0.4)] transition-all">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-fuchsia-500 border-[3px] border-black p-3 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <IoRocket className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-4xl font-black uppercase italic dark:text-white tracking-tighter">
              Join Us
            </h2>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mt-2">
              Create your identity
            </p>
          </div>

          {errors.default && (
            <div className="mb-6 p-4 bg-rose-500 border-[3px] border-black text-white font-black flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <IoWarning className="w-6 h-6 shrink-0" />
              <span className="uppercase text-xs">{errors.default}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Full Name
              </label>
              <div className="relative">
                <IoPerson className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black dark:text-fuchsia-500" />
                <input
                  type="text"
                  placeholder="JOHN DOE"
                  value={user.full_name}
                  onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 border-[3px] border-black font-bold uppercase bg-white dark:bg-[#0D0221] dark:text-white outline-none transition-all ${
                    errors.full_name ? "border-rose-500 ring-2 ring-rose-500" : "focus:bg-fuchsia-50 dark:focus:bg-fuchsia-900/20"
                  }`}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Email Address
              </label>
              <div className="relative">
                <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black dark:text-fuchsia-500" />
                <input
                  type="email"
                  placeholder="YOU@PROVIDER.COM"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 border-[3px] border-black font-bold uppercase bg-white dark:bg-[#0D0221] dark:text-white outline-none transition-all ${
                    errors.email ? "border-rose-500 ring-2 ring-rose-500" : "focus:bg-fuchsia-50 dark:focus:bg-fuchsia-900/20"
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Security Key
              </label>
              <div className="relative">
                <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black dark:text-fuchsia-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  className={`w-full pl-12 pr-12 py-3 border-[3px] border-black font-bold bg-white dark:bg-[#0D0221] dark:text-white outline-none transition-all ${
                    errors.password ? "border-rose-500 ring-2 ring-rose-500" : "focus:bg-fuchsia-50 dark:focus:bg-fuchsia-900/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black dark:text-fuchsia-500"
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 border-[3px] border-black font-black uppercase italic text-lg flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(192,38,211,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                "Initialize Account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center font-black uppercase text-[10px] tracking-widest dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to={`/login?type=${type}`}
              className="text-fuchsia-600 dark:text-fuchsia-400 hover:underline decoration-[2px]"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;