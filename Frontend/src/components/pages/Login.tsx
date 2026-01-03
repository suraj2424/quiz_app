import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import { toast } from "react-toastify";
import { TokenContext } from "../../contexts/TokenContextProvider";
import { AlreadyLoggedIn } from "./Login/AlreadyLoggedIn";
import { LoginForm } from "./Login/LoginForm";
import { User, LoginResponse } from "./Login/types";

const cookies = new Cookies();

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
      <AlreadyLoggedIn
        onLogout={() => {
          cookies.remove("token");
          setToken("");
        }}
      />
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
        <LoginForm
          user={user}
          setUser={setUser}
          errors={errors}
          loading={loading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          handleSubmit={handleSubmit}
          type={type}
        />
      </motion.div>
    </div>
  );
};

export default Login;