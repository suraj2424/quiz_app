import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { TextInput } from "./TextInput";
import { PasswordInput } from "../Login/PasswordInput";
import { SubmitButton } from "../Login/SubmitButton";
import { RegisterFormProps } from "./types";

export const RegisterForm = ({
  user,
  setUser,
  errors,
  loading,
  showPassword,
  setShowPassword,
  handleSubmit,
  type,
}: RegisterFormProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="backdrop-blur-xl bg-white/90 p-8 rounded-2xl shadow-xl w-full"
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
      <TextInput
        label="Full Name"
        type="text"
        value={user.full_name}
        onChange={(value) => setUser({ ...user, full_name: value })}
        placeholder="Enter your full name"
        error={errors.full_name}
      />

      <TextInput
        label="Email Address"
        type="email"
        value={user.email}
        onChange={(value) => setUser({ ...user, email: value })}
        placeholder="Enter your email"
        error={errors.email}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Password
        </label>
        <PasswordInput
          value={user.password}
          onChange={(value) => setUser({ ...user, password: value })}
          error={errors.password}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </div>

      <SubmitButton 
        loading={loading} 
        text="Create Account"
        loadingText="Creating Account..."
      />
    </form>

    <p className="mt-8 text-center text-gray-600">
      Already have an account?{" "}
      <Link
        to={`/login?type=${type}`}
        className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
      >
        Sign In
      </Link>
    </p>
  </motion.div>
);

export default RegisterForm;
