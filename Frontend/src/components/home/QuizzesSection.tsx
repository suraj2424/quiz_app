import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import QuizCard from "../QuizCard/QuizCard";

interface Quiz {
  _id: string;
  title: string;
  difficulty: string;
  tags: string[];
  questionCount: number;
  createdBy: {
    name?: string;
  };
}

interface QuizzesSectionProps {
  quizzes: Quiz[];
  error?: string | null;
}

export default function QuizzesSection({
  quizzes,
  error,
}: QuizzesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(
    () => [...new Set(quizzes.flatMap((q: Quiz) => q.tags))],
    [quizzes],
  );

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz: Quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.tags.some((t: string) =>
          t.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesDiff =
        selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;
      const matchesCat =
        selectedCategory === "all" || quiz.tags.includes(selectedCategory);
      return matchesSearch && matchesDiff && matchesCat;
    });
  }, [quizzes, searchTerm, selectedDifficulty, selectedCategory]);

  if (error)
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-rose-500 border-[4px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
          <AlertCircle className="w-12 h-12 text-white" />
          <h3 className="text-2xl font-black text-white uppercase italic">
            {error}
          </h3>
        </div>
      </div>
    );

  return (
    <section
      id="quizzes-section"
      className="py-20 bg-white dark:bg-[#0D0221] border-t-[4px] border-black"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 space-y-4">
          <div className="inline-block bg-amber-400 border-[3px] border-black px-4 py-1 font-black uppercase italic text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Quiz Library
          </div>
          <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter text-black dark:text-white">
            CHOOSE YOUR{" "}
            <span className="text-teal-500 underline decoration-[6px]">
              BATTLE
            </span>
          </h2>
        </div>

        {/* Search and Filters: Neo-Brutalist Box */}
        <div className="bg-white dark:bg-[#1a1a2e] border-[4px] border-black p-8 mb-12 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(20,184,166,0.5)] transition-colors">
          <div className="flex items-center gap-2 mb-8 bg-black dark:bg-teal-500 text-white dark:text-black p-2 inline-flex border-[2px] border-black">
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-black uppercase text-sm tracking-tighter">
              Filter Console
            </span>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Search Input */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Search Keywords
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black dark:text-teal-500" />
                <input
                  type="text"
                  placeholder="WHAT DO YOU WANT TO LEARN?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-[3px] border-black font-black uppercase placeholder:text-gray-400 bg-white dark:bg-[#0D0221] dark:text-white focus:bg-teal-50 dark:focus:bg-teal-900/30 outline-none transition-all"
                />
              </div>
            </div>

            {/* Difficulty Select */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Difficulty
              </label>
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-4 border-[3px] border-black font-black uppercase appearance-none bg-white dark:bg-[#0D0221] dark:text-white cursor-pointer outline-none focus:ring-0"
                >
                  {["all", "beginner", "intermediate", "advanced"].map((d) => (
                    <option
                      key={d}
                      value={d}
                      className="bg-white dark:bg-[#1a1a2e]"
                    >
                      {d}
                    </option>
                  ))}
                </select>
                {/* Custom arrow for neo-brutalist feel */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-black">
                  ↓
                </div>
              </div>
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-4 border-[3px] border-black font-black uppercase appearance-none bg-white dark:bg-[#0D0221] dark:text-white cursor-pointer outline-none"
                >
                  <option value="all" className="bg-white dark:bg-[#1a1a2e]">
                    Everywhere
                  </option>
                  {categories.map((c: string) => (
                    <option
                      key={c}
                      value={c}
                      className="bg-white dark:bg-[#1a1a2e]"
                    >
                      {c}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-black">
                  ↓
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredQuizzes.map((quiz: Quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-[4px] border-black border-dashed">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="font-black uppercase text-xl">
              Nothing found in the archives
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDifficulty("all");
                setSelectedCategory("all");
              }}
              className="mt-4 text-teal-600 underline font-black uppercase"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
