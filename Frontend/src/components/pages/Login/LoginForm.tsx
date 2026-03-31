import React from "react";
import { Link } from "react-router-dom";
import { IoMail, IoLockClosed, IoEye, IoEyeOff, IoWarning, IoPlay } from "react-icons/io5";

interface LoginFormProps {
  user: { email: string; password: string };
  setUser: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  errors: Record<string, string>;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  type: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({
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
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-[#1a1a2e] border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(20,184,166,0.4)] transition-all">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-teal-500 border-[3px] border-black p-3 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <IoLockClosed className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-4xl font-black uppercase italic dark:text-white tracking-tighter">
            User Login
          </h2>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mt-2">
            Enter credentials to proceed
          </p>
        </div>

        {/* Error Alert */}
        {errors.default && (
          <div className="mb-6 p-4 bg-rose-500 border-[3px] border-black text-white font-black flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <IoWarning className="w-6 h-6 shrink-0" />
            <span className="uppercase text-xs">{errors.default}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Email Address
            </label>
            <div className="relative">
              <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black dark:text-teal-500" />
              <input
                type="email"
                placeholder="YOUR@EMAIL.COM"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className={`w-full pl-12 pr-4 py-4 border-[3px] border-black font-bold uppercase placeholder:text-gray-300 bg-white dark:bg-[#0D0221] dark:text-white outline-none transition-all ${
                  errors.email ? "border-rose-500 ring-2 ring-rose-500" : "focus:bg-teal-50 dark:focus:bg-teal-900/20"
                }`}
              />
            </div>
            {errors.email && <p className="text-[10px] font-black text-rose-500 uppercase italic">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Password
              </label>
              <Link to="/forgot-password" className="text-[10px] font-black uppercase text-gray-400 hover:text-teal-500 transition-colors">
                [ Lost Key? ]
              </Link>
            </div>
            <div className="relative">
              <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black dark:text-teal-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className={`w-full pl-12 pr-12 py-4 border-[3px] border-black font-bold bg-white dark:bg-[#0D0221] dark:text-white outline-none transition-all ${
                  errors.password ? "border-rose-500 ring-2 ring-rose-500" : "focus:bg-teal-50 dark:focus:bg-teal-900/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black dark:text-teal-500 hover:scale-110 transition-transform"
              >
                {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] font-black text-rose-500 uppercase italic">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-5 border-[3px] border-black font-black uppercase italic text-xl flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(20,184,166,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                SIGN IN <IoPlay className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center font-black uppercase text-xs tracking-tighter dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to={`/register?type=${type}`}
            className="text-purple-600 dark:text-teal-400 hover:underline decoration-[3px]"
          >
            Join the collective
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;