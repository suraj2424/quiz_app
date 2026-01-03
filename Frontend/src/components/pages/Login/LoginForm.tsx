import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import { LoginFormProps } from "./types";
import { ErrorAlert } from "./ErrorAlert";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { SubmitButton } from "./SubmitButton";

export const LoginForm = ({
  user,
  setUser,
  errors,
  loading,
  showPassword,
  setShowPassword,
  handleSubmit,
  type
}: LoginFormProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="backdrop-blur-xl bg-white/90 p-8 rounded-2xl shadow-xl max-w-md w-full"
  >
    <div className="text-center mb-10">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-full 
                   bg-gradient-to-r from-indigo-500 to-purple-500 mb-6 shadow-lg shadow-purple-500/25"
      >
        <CiLogin className="w-10 h-10 text-white" />
      </motion.div>
      <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
      <p className="mt-2 text-gray-600">Sign in to your account</p>
    </div>

    {errors.default && <ErrorAlert message={errors.default} />}

    <form onSubmit={handleSubmit} className="space-y-5">
      <EmailInput
        value={user.email}
        onChange={(email) => setUser({ ...user, email })}
        error={errors.email}
      />

      <PasswordInput
        value={user.password}
        onChange={(password) => setUser({ ...user, password })}
        error={errors.password}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />

      <div className="flex items-center justify-center">
        <Link
          to="/forgot-password"
          className="text-sm text-purple-600 hover:text-purple-700 
                     font-medium transition-colors"
        >
          Forgot Password?
        </Link>
      </div>

      <SubmitButton loading={loading} />
    </form>

    <p className="mt-8 text-center text-gray-600">
      Don't have an account?{" "}
      <Link
        to={`/register?type=${type}`}
        className="font-medium text-purple-600 hover:text-purple-700 
                   transition-colors"
      >
        Create Account
      </Link>
    </p>
  </motion.div>
);