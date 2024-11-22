import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import { toast } from "react-toastify";
import { CiLogin } from "react-icons/ci";
import { TokenContext } from "../contexts/TokenContextProvider";

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

    try {
      const response = await fetch("http://localhost:5000/api/login", {
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
        <div className="backdrop-blur-xl bg-white bg-opacity-100 p-8 rounded-lg border border-gray-500/20 shadow-2xl shadow-fuchsia-500/10">
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 mb-4"
            >
              <CiLogin className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-violet-400">
              Welcome Back
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

          <form onSubmit={handleSubmit} className="space-y-6 text-sm">
            <div>
              <motion.input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email Address"
                className={`w-full px-4 py-2 bg-slate-50 border-2 rounded text-black 
                placeholder:text-gray-400/100 transition-colors duration-300 outline-none 
                backdrop-blur-xl ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-400"
                    : "border-gray-500/30 focus:border-gray-800"
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
                className={`w-full px-4 py-2 bg-slate-50 border-2 rounded text-black 
                placeholder:text-gray-500/50 transition-colors duration-300 outline-none 
                backdrop-blur-xl ${
                  errors.password
                    ? "border-red-500/50 focus:border-red-400"
                    : "border-gray-500/30 focus:border-gray-800"
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
                  "Sign In"
                )}
              </motion.button>
            </div>
          </form>

          <p className="mt-6 text-center text-gray-500">
            Don't have an account?{" "}
            <Link
              to={`/register?type=${type}`}
              className="text-sky-400 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;