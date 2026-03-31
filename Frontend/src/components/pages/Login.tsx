import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../contexts/UserContext";
import LoginForm from "./Login/LoginForm";
import { AlreadyLoggedIn } from "./Login/AlreadyLoggedIn";
import ThemeToggle from "../common/ThemeToggle";

const Login = () => {
  const { token, login, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [userForm, setUserForm] = useState({ email: "", password: "" });

  const params = new URLSearchParams(location.search);
  const type = params.get("type");

  // Redirect if already logged in (Logic Fix)
  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!userForm.email || !userForm.password) {
      setErrors({
        email: !userForm.email ? "Email is required" : "",
        password: !userForm.password ? "Password is required" : "",
      });
      return;
    }

    setLoading(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${backendUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userForm, type }),
      });
      
      const data = await response.json();

      if (response.ok) {
        // Ensure we have valid user data
        if (data.user && typeof data.user === 'object') {
          login(data.token, data.user);
        } else {
          // If no user data, just set token and handle user separately
          login(data.token, null);
        }
        toast.success("Welcome back!");
        navigate("/");
      } else {
        setErrors({ default: data.message || "Invalid credentials" });
      }
    } catch (error) {
      setErrors({ default: "Connection error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-white dark:bg-[#0D0221] transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent dark:from-fuchsia-500/5" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]" />
      </div>

      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <AnimatePresence mode="wait">
          {token ? (
            <AlreadyLoggedIn key="already" onLogout={logout} />
          ) : (
            <LoginForm
              key="form"
              user={userForm}
              setUser={setUserForm}
              errors={errors}
              loading={loading}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              handleSubmit={handleSubmit}
              type={type}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;