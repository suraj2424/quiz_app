import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import { toast } from "react-toastify";
import { CiLogin } from "react-icons/ci";
import { TokenContext } from "../../contexts/TokenContextProvider";
import { IoMail, IoLockClosed, IoWarning, IoEye, IoEyeOff } from "react-icons/io5";

const cookies = new Cookies();

interface User {
    email: string;
    password: string;
    type?: string;
}

interface LoginResponse {
    token: string;
    message?: string;
}

const Login = () => {
  const { setToken, token } = useContext(TokenContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const params = new URLSearchParams(location.search);
  const type = params.get("type");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!user.email || !user.password) {
      setErrors({
        email: !user.email ? "Required" : "",
        password: !user.password ? "Required" : "",
      });
      return;
    }

    setLoading(true);

    if (type) {
      setUser((prev: User) => ({ ...prev, type }));
    }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${backendUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data: LoginResponse = await response.json();

      if (response.ok) {
        setToken(data.token);
        toast.success("Welcome back!");
        cookies.set("token", data.token, {
          path: "/",
          secure: true,
          sameSite: "strict",
          domain: window.location.hostname,
        });
        navigate("/");
      } else {
        setErrors({
          default: data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      setErrors({ default: "Connection error" });
    } finally {
      setLoading(false);
    }
  };

  if(cookies.get("token")) {
    const token = cookies.get("token");
    setToken(token);
  }

  if(token) {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="px-10 py-5 border border-gray-200 rounded p-4 bg-slate-100" >
                <p>You are already logged in!</p>
                <button 
                    onClick={() => {
                        cookies.remove("token");
                        setToken("");
                    }}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    )
  }

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

  {errors.default && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600"
    >
      <div className="flex items-center gap-2">
        <IoWarning className="w-5 h-5 flex-shrink-0" />
        <span>{errors.default}</span>
      </div>
    </motion.div>
  )}

  <form onSubmit={handleSubmit} className="space-y-5">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Email Address
      </label>
      <motion.div className="relative">
        <IoMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Enter your email"
          className={`w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-gray-900 
                     placeholder:text-gray-400 transition-all duration-200
                     ${errors.email
            ? "border-2 border-rose-500 focus:border-rose-500"
            : "border border-gray-200 focus:border focus:border-purple-500"
          } outline-none`}
        />
      </motion.div>
      {errors.email && (
        <p className="mt-1.5 text-rose-500 text-sm">{errors.email}</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Password
      </label>
      <motion.div className="relative">
        <IoLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type={showPassword ? "text" : "password"}
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Enter your password"
          className={`w-full pl-12 pr-12 py-3 bg-gray-50 rounded-xl text-gray-900 
                     placeholder:text-gray-400 transition-all duration-200
                     ${errors.password
            ? "border-2 border-rose-500 focus:border-rose-500"
            : "border border-gray-200 focus:border focus:border-purple-500"
          } outline-none`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                     hover:text-gray-600 transition-colors"
        >
          {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
        </button>
      </motion.div>
      {errors.password && (
        <p className="mt-1.5 text-rose-500 text-sm">{errors.password}</p>
      )}
    </div>

    <div className="flex items-center justify-center">
      
      <Link
        to="/forgot-password"
        className="text-sm text-purple-600 hover:text-purple-700 
                   font-medium transition-colors"
      >
        Forgot Password?
      </Link>
    </div>

    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      type="submit"
      disabled={loading}
      className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 
                 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25
                 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200
                 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white 
                         rounded-full animate-spin" />
          <span>Signing In...</span>
        </div>
      ) : (
        "Sign In"
      )}
    </motion.button>
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
      </motion.div>
    </div>
  );
};

export default Login;