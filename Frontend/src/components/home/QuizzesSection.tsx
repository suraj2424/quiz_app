// components/QuizzesSection.tsx
import { useState, useMemo } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  AlertCircle, 
  BookOpen,
  ArrowRight,
  Loader2,
  FolderOpen
} from "lucide-react";
import QuizCard from "../QuizCard/QuizCard";

interface Quiz {
  _id: string;
  id: number;
  title: string;
  tags: string[];
  difficulty: string;
  questionCount: number;
  questions: {
    id: number;
    question: string;
    options: string[];
    answer: string;
  }[];
  createdBy: {
    name?: string;
  };
}

interface QuizzesSectionProps {
  quizzes: Quiz[];
  isLoading?: boolean;
  error?: string | null;
}

export default function QuizzesSection({ quizzes, isLoading, error }: QuizzesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get unique categories from quiz tags
  const categories = useMemo(() => {
    const allTags = quizzes.flatMap(quiz => quiz.tags);
    return [...new Set(allTags)];
  }, [quizzes]);

  // Filter quizzes based on search and filters
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quiz.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === "all" || quiz.tags.includes(selectedCategory);
      
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [quizzes, searchTerm, selectedDifficulty, selectedCategory]);

  const difficulties = ["all", "beginner", "intermediate", "advanced"];

  if (error) {
    return (
      <section id="quizzes-section" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load quizzes</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quizzes-section" className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100/60 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Quiz Library</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Quiz Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from hundreds of expertly crafted quizzes across various subjects and difficulty levels.
            Test your knowledge and track your progress.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900">Filter Quizzes</span>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            
            {/* Search */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Quizzes
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by title or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === "all" ? "All Levels" : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading quizzes...
                </span>
              ) : (
                <span>
                  Showing <span className="font-semibold text-gray-900">{filteredQuizzes.length}</span> of{" "}
                  <span className="font-semibold text-gray-900">{quizzes.length}</span> quizzes
                </span>
              )}
            </p>
            
            {(searchTerm || selectedDifficulty !== "all" || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDifficulty("all");
                  setSelectedCategory("all");
                }}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded-lg mb-2 w-3/4" />
                    <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded-lg" />
                  <div className="h-4 bg-gray-200 rounded-lg w-5/6" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-7 bg-gray-200 rounded-full w-20" />
                    <div className="h-7 bg-gray-200 rounded-full w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quiz Grid */}
        {!isLoading && (
          <>
            {filteredQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz) => (
                  <QuizCard key={quiz._id} quiz={quiz} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FolderOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedDifficulty("all");
                      setSelectedCategory("all");
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* View All Button */}
        {!isLoading && filteredQuizzes.length > 0 && filteredQuizzes.length < quizzes.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDifficulty("all");
                setSelectedCategory("all");
              }}
              className="group inline-flex items-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold rounded-xl transition-all duration-200"
            >
              View All Quizzes
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}