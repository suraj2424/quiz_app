import Header from "./Header";
import HeroSection from "./HeroSection";
import QuizzesSection from "./QuizzesSection";
import FeaturesSection from "./FeaturesSection";
import { useQuizData } from "../../hooks/useQuizData";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

export default function Home() {
  const { quizzes } = useQuizData();
  useDocumentMeta();


  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-cyan-600 selection:text-white transition-colors duration-300">
      <Header />
      <main className="bg-white dark:bg-slate-950 transition-colors duration-300">
        <HeroSection />
        <QuizzesSection quizzes={quizzes} />
        <FeaturesSection />
      </main>
    </div>
  );
}
