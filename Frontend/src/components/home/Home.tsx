// Home.tsx
import { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import QuizzesSection from "./QuizzesSection";
import FeaturesSection from "./FeaturesSection";
import LoadingSpinner from "./LoadingSpinner";
import { useQuizData } from "../../hooks/useQuizData";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { useToken } from "../../contexts/useToken";

export interface UserData {
  name: string;
  email: string;
  id: string;
  type: string;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, removeToken } = useToken();
  
  const { quizzes } = useQuizData();
  useDocumentMeta();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const verifyToken = useCallback(async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    try {
      const response = await fetch(`${backendUrl}/api/verify-token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      } else {
        setUserData(null);
        removeToken();
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      setUserData(null);
    }
  }, [token, removeToken]);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token, verifyToken]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen selection:bg-cyan-600 selection:text-white">
      <Header 
        userData={userData} 
        onLogout={() => {
          setUserData(null);
          removeToken();
          window.location.reload();
        }} 
      />
      <main className="bg-white">
        <HeroSection />
        <QuizzesSection quizzes={quizzes} />
        <FeaturesSection />
      </main>
    </div>
  );
}