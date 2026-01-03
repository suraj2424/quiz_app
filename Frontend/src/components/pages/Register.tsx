import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, FormErrors, ApiResponse } from "./Register/types";
import { RegisterForm } from "./Register/RegisterForm";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [type, setType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<User>({
    full_name: "",
    email: "",
    password: "",
    type: "",
  });

  // Handle URL parameter for user type
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type") || "";
    setType(typeParam);
    setUser(prev => ({ ...prev, type: typeParam }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
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
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/register`, {
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
        <RegisterForm
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

export default Register;