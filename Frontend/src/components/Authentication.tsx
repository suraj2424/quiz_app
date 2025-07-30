import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../contexts/TokenContextProvider";
import { Cookies } from "react-cookie";
import { toast } from "react-toastify";

const cookieConfig = {
  path: '/',
  secure: true, // Only sent over HTTPS
  sameSite: 'strict' as const, // Protect against CSRF
  domain: window.location.hostname, // Only your domain
  // Add maxAge if you want the cookie to expire after a specific time
  // maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

const cookies = new Cookies();

const getToken = (): string | null => {
  return cookies.get('token') || null;
};

const removeToken = (): void => {
  cookies.remove('token', cookieConfig);
};


export default function Authentication() {
  const { setToken } = useContext(TokenContext);
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(true);
  interface FormErrors {
    full_name?: string;
    email?: string;
    password?: string;
    default?: string;
  }
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    full_name: "",
    email: "",
    password: "",
    type: "",
  });

  useEffect(() => {
    const tokenCookie = getToken();
    if (tokenCookie) {
      setIsLoggedIn(true);
    }

    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    if (type) {
      setUser((prev) => ({ ...prev, type }));
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUser({ ...user, [e.target.id]: e.target.value });
    setErrors({});
  };

  interface AuthResponse {
    token: string;
    message?: string;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const { email, password, full_name } = user;
    setErrors({});

    if (isRegister && (!full_name || !email || !password)) {
      setErrors({
        full_name: !full_name ? "Required" : "",
        email: !email ? "Required" : "",
        password: !password ? "Required" : "",
      });
      return;
    }

    if (!isRegister && (!email || !password)) {
      setErrors({
        email: !email ? "Required" : "",
        password: !password ? "Required" : "",
      });
      return;
    }

    setLoading(true);

    try {
      const endpoint: string = isRegister ? "/register" : "/login";
      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
      const response: Response = await fetch(
        `${backendUrl}/api${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );
      const data: AuthResponse = await response.json();

      if (response.ok) {
        if (isRegister) {
          setIsRegister(false);
          toast.success("Registration successful, you can now login");
          setUser({ full_name: "", email: "", password: "", type: "" });
        } else {
          setToken(data.token);
          toast.success("Login successful");
          document.cookie = `token=${data.token}; path=/;`;
          setIsLoggedIn(true);
          navigate("/");
        }
      } else {
        setErrors({
          email:
            data.message === "Email already exists"
              ? "Email already exists"
              : "",
          default: data.message || `Authentication failed`,
        });
      }
    } catch (error) {
      setErrors({ default: "Connection error" });
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center overflow-hidden">
        <div className="absolute w-full h-full inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-black to-black opacity-100">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="backdrop-blur-xl bg-black/30 p-8 rounded border border-blue-500/20 shadow-2xl shadow-blue-500/10">
            <h1 className="text-2xl text-center mb-6 text-blue-400">
              Already Logged In
            </h1>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-bold relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity" />
              LOGOUT
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center overflow-hidden">
      <div className="absolute w-full h-full inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-black to-black opacity-100">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-black/30 p-8 rounded border border-blue-500/20 shadow-2xl shadow-blue-500/10">
          <h1 className="text-4xl py-2 font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
            {isRegister ? "Register" : "Login"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.default && (
              <div className="text-red-400 text-sm text-center mb-4 bg-red-500/10 py-2 rounded">
                {errors.default}
              </div>
            )}

            {isRegister && (
              <div className="form-group h-20">
                <motion.input
                  type="text"
                  id="full_name"
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 bg-black/50 border rounded text-blue-400 placeholder:text-blue-500/50 transition-colors outline-none backdrop-blur-xl ${
                    errors.full_name
                      ? "border-red-500 focus:border-red-400"
                      : "border-blue-500/30 focus:border-blue-400"
                  }`}
                  onChange={handleChange}
                  value={user.full_name}
                />
                <div className="h-5 mt-1">
                  {errors.full_name && (
                    <p className="text-red-400 text-xs">{errors.full_name}</p>
                  )}
                </div>
              </div>
            )}

            <div className="form-group h-20">
              <motion.input
                type="email"
                id="email"
                placeholder="Email Address"
                className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-blue-400 placeholder:text-blue-500/50 transition-colors outline-none backdrop-blur-xl ${
                  errors.email
                    ? "border-red-500 focus:border-red-400"
                    : "border-blue-500/30 focus:border-blue-400"
                }`}
                onChange={handleChange}
                value={user.email}
              />
              <div className="h-5 mt-1">
                {errors.email && (
                  <p className="text-red-400 text-xs">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="form-group h-20">
              <motion.input
                whileFocus={{ scale: 1 }}
                type="password"
                id="password"
                placeholder="Password"
                className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-blue-400 placeholder:text-blue-500/50 transition-colors outline-none backdrop-blur-xl ${
                  errors.password
                    ? "border-red-500 focus:border-red-400"
                    : "border-blue-500/30 focus:border-blue-400"
                }`}
                onChange={handleChange}
                value={user.password}
              />
              <div className="h-5 mt-1">
                {errors.password && (
                  <p className="text-red-400 text-xs">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
              >
                {isRegister ? "Already a User?" : "New User?"}
              </button>
            </div>

            <div className="w-full justify-center items-center flex mt-6">
              <motion.button
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-1/2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-200 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : isRegister ? (
                  "REGISTER"
                ) : (
                  "LOGIN"
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}